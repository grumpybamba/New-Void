var fs = require('fs');
var jsonFile = "pathToYourJSONFile/project.json";
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
var contractAddress = '0xA116e312c1aEa5401db36d2b303F3B6Fe2316bEa';

var YourContract= new web3.eth.Contract(abi, contractAddress);

async function MintFragmnet() {
  const instance = await ethereum.isConnected();
  const Web3Provider = new ethers.providers.Web3Provider(instance, "any");
  if ((await Web3Provider.getNetwork()).chainId !== 4){
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x4' }],
  });
  console.log((await Web3Provider.getNetwork()).chainId);
//window.location.reload();
}
  const signer = Web3Provider.getSigner()
  const contract = await new ethers.Contract(contractaddress, abi, signer);
  const transaction = await contract.claimfragment(3, {
          value: 0,
        });
  await transaction.wait()
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mintbutton').addEventListener("click", async() => {
        MintFragment();
    })
})