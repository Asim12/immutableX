// Requiring in-built https for creating
// https server
const http = require("http");

// Express for handling GET and POST request
const express = require("express");
const app = express();

// Requiring file system to use local files
const fs = require("fs");

// Parsing the form of body to take
// input from forms
const bodyParser = require("body-parser");

// Configuring express to use body-parser
// as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const NFT = require('./artifacts/contracts/NFT.sol/NFT.json')
const Market = require('./artifacts/contracts/Market.sol/NFTMarket.json')
const ethers = require('ethers')
// const ethers = require('ethers')
const Web3 = require('web3');
const helper = require('./helper/helper')

const nftmarketaddress = '0x4f4b52ADCf4AacF5C51D0D505450d311234eAd29'
const nftaddress       = '0x3cf99a5a4490D9240625E26989c533eeC86047F8'

// const provider      =  new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/defd019df2c0685181b50e9a/polygon/mumbai')
const provider         =  new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:8545')

// Get request for root of the app
app.get("/", function (req, res) {

// Sending index.html to the browser
res.sendFile(__dirname + "/index.html");
});

// Post request for geetting input from
// the form
app.post("/mssg", function (req, res) {

// Logging the form body
console.log(req.body);

// Redirecting to the root
res.redirect("/");
});

// Creating https server by passing
// options and app object
http.createServer(app)
.listen(3000, function (req, res) {
console.log("Server started at port 3000");
});


app.post('/mintNFT', async(req, res) => {
    if(req.body.price && req.body.url && req.body.walletAddress && req.body.chainId && req.body.signer){
        let url           =  req.body.url;
        let priceComming  =  (req.body.price).toString();
        let walletAddress =  req.body.walletAddress;

        if(req.body.chainId != 1){
            let response = {
                message  :   'Please connect your metamask with main net!!'
            }
            res.status(404).send(response);
        }
        // let signer        =  req.body.signer
        // const web3Modal   =  new Web3Modal()
        // const connection  =  await web3Modal.connect()
        // const provider    =  new ethers.providers(connection)  
        const signer      =  provider.getSigner()
        let contract      =  new ethers.Contract(nftaddress, NFT.abi, signer)

        let WalletAmountEther = await helper.getBalanceOfWalletAddress(walletAddress)
        console.log('WalletAmountEther', WalletAmountEther)

        // // let gassLimit = await helper.calculateGassLimit()
        if(WalletAmountEther != false &&  WalletAmountEther > 0){
            /* next, create the item */
            let transaction = await contract.createToken(url)
            // console.log('transaction ====', transaction)
            let tx = await transaction.wait()
            try{
                var event = tx.events[0]
                var value = event.args[2]
                var tokenId = value.toNumber()
                var price = ethers.utils.parseUnits(priceComming, 'ether')
            }catch(error){

                let response = {
                    message  :   'Contract address not valid!!!! '
                }
                res.status(404).send(response);
            }
            /* then list the item for sale on the marketplace */
            contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
            let listingPrice = await contract.getListingPrice()
            listingPrice = listingPrice.toString()
            
            transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
            await transaction.wait()
            console.log('transaction', transaction)

            let response = {
                transaction  :   transaction
            }
            res.status(200).send(response);

        }else{
            let response = {
                message  :   'You do not have enough amount for Mint!!!'
            }
            res.status(404).send(response);
        }
    }else{

        let response = {
            message  :   'Payload Issue!!!!!!!!'
        }
        res.status(404).send(response);
    }
})

app.post('/buyNFT', async(req, res) => {

    if(req.body.walletAddress && req.body.price && req.body.tokenId && req.body.chainId && req.body.signer){

        let walletAddress = req.body.walletAddress ;
        let priceComming  = req.body.price ;
        let tokenId       = req.body.tokenId ;

        if(req.body.chainId != 1){
            let response = {
                message  :   'Please connect your metamask with main net!!'
            }
            res.status(404).send(response);
        }
        /* needs the user to sign the transaction, so will use Web3Provider and sign it */
        // const web3Modal = new Web3Modal()
        // const connection = await web3Modal.connect()
        // const provider = new ethers.providers.Web3Provider(connection)
        const signer   =  provider.getSigner()
        const contract =  new ethers.Contract(nftmarketaddress, Market.abi, signer)

        let WalletAmountEther = await helper.getBalanceOfWalletAddress(walletAddress)
        console.log('WalletAmountEther', WalletAmountEther)

        if(WalletAmountEther != false &&  WalletAmountEther > 0){

            /* user will be prompted to pay the asking proces to complete the transaction */
            const price = ethers.utils.parseUnits(priceComming.toString(), 'ether')   
            try{

                const transaction = await contract.createMarketSale(nftaddress, tokenId, {
                    value: price
                })
                let receipt = await transaction.wait()
        
                let response = {   
                    data  :   receipt
                }
                res.status(200).send(response);
            }catch(error){
                let response = {   
                    message  :   'tokenId not valid!!!!!!'
                }
                res.status(200).send(response);
            }
        }else{
            let response = {
                message  :   'unknown account or account have insufficient fund!!!!'
            }
            res.status(404).send(response);
        }
    }else{
        let response = {
            message  :   'Payload Issue!!!!!!!!'
        }
        res.status(404).send(response);
    }
})

/* Returns only items that a user has unsold */
app.get('/getMarketPlace', async(req, res) => {
    try{
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
        const data = await marketContract.fetchMarketItems()
        let response = {
            data  :   data
        }
        res.status(200).send(response);
    }catch(error){

        let response = {
            message  :   error
        }
        res.status(404).send(response);
    }
})
