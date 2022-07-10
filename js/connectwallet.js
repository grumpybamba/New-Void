const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

let web3Modal

let contractaddress = "0xAF6cD7520dfA2B12983E5172EDd312BeFB3cFBc3";

let provider;

let abi;

let selectedAccount;

function grabData() {
    fetch('https://grumpybamba.github.io/New-Void/assets/abi.json')
    .then(response => {
        return response.json().then(function(data) {
            abi = data;
            console.log(data);
        });
    })

}

grabData();

async function ChangeChain(){
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x4' }],
  });
}

function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}

async function fetchAccountData() {

  const web3 = new Web3(provider);
  console.log("Web3 instance is", web3);
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);

  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  document.querySelector("#btn-disconnect").textContent = selectedAccount.slice(0,5) + "...." + selectedAccount.slice(selectedAccount.length-5,selectedAccount.length);

  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");
  
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";
}


async function refreshAccountData() {

  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  if (window.ethereum.networkVersion != '4'){
    ChangeChain();
  }

  provider.on("accountsChanged", (accounts) => {  
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];
  document.querySelector("#disconnect-btn").textContent = selectedAccount.slice(0,5) + "...." + selectedAccount.slice(selectedAccount.length-5,selectedAccount.length);

  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";

  console.log('connected');
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  if(provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


async function MintFragmnet() {
  if (provider == undefined){
      provider = await web3Modal.connect();
  }
  if (window.ethereum.networkVersion != '4'){
    ChangeChain();
  }
  const Web3Provider = new _ethers.providers.Web3Provider(provider, "any");
  const signer = Web3Provider.getSigner();
  const contract = await new _ethers.Contract(contractaddress, abi, signer);
  const transaction = await contract.mintfragment(2, {
          value: _ethers.BigNumber.from("25000000000000000"),
        });
  await transaction.wait();
}

window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-mint").addEventListener("click", MintFragmnet);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});