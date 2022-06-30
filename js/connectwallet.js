const getWeb3 = async () => {
    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(window.ethereum)
        try {
            await window.ethereum.request({method: "eth_requestAccounts"})
            resolve(web3)
        } catch (error){
            reject(error)
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connect_button').addEventListener("click", async() => {
        const web3 = await getWeb3()
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const walletBalanceInWei = await web3.eth.getBalance(accounts[0])
        const walletBalanceInEth = Math.round(Web3.utils.fromWei(walletBalanceInWei)*1000) / 1000
        document.getElementById('connect_button').innerText = accounts[0].slice(0,5) + "...." + accounts[0].slice(accounts[0].length-5,accounts[0].length) + ": " + walletBalanceInEth;
    })
})