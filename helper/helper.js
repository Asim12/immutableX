 
const ethers = require('ethers')
const Web3 = require('web3');
const provider   = "HTTP://127.0.0.1:8545";
const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

const nftContractAddress        =  "0xd9145CCE52D386f254917e481eB44e9943F39138"
const nftmarketContractAddress  =  "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"
 
 
module.exports = {

    getBalanceOfWalletAddress : (walletAddress) => {
        return new Promise(async(resolve) => {
            //get user wallet balance
            try{
                const ethBalance = await Web3Client.eth.getBalance(walletAddress)
                const ethAmount  = await parseFloat(Web3Client.utils.fromWei(ethBalance, 'ether'))
                resolve(ethAmount)    
            }catch(error){

                resolve(false)
            }
        })
    },


    calculateGassLimit : () => {
        return new Promise(async(resolve) => {
        })
    }
}
 