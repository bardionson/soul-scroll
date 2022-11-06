require("dotenv").config()
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(alchemyKey)

const contractABI = require("../SoulScroll.json")
//const contractAddress = "0xb3bDAa89E575418c670A70a7ebEF7838Afb5AC77"
//const contractAddress = "0x468B10B1B1Fb91836eF38188CBECbcB025dA4850"
//const contractAddress = "0x1c951e53c7172b9d7b4e7cAf466BD4057c80F9c2"
//const contractAddress = "0x7A01b80720ab95bC04F7e613AAEb42d3CFE76A83"
const contractAddress = "0xd44e37d09243a008eE1ae7838459D7FaaD9D250C"

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const obj = {
        status: "👆 Select the number of times you want your prayer read out loud.",
        address: addressArray[0],
      }
      return obj
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    }
  }
}

export const orderPrayer = async (numPrayerReadings) => {
   window.contract = await new web3.eth.Contract(contractABI, contractAddress)
   const payment = numPrayerReadings==0?1:numPrayerReadings
   //set up your Ethereum transaction 38D7EA4C68000
   const transactionParameters = {
     to: contractAddress, // Required except during contract publications.
     from: window.ethereum.selectedAddress, // must match user's active address.
     value: (10000000000000000*payment).toString(16),
     data: window.contract.methods
       .orderPrayer(window.ethereum.selectedAddress, numPrayerReadings)
       .encodeABI(), //make call to NFT smart contract
   }
   //sign the transaction via MetaMask
   try {
     const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })
    let receipt = null
    /* eslint-disable no-await-in-loop */
    while (!receipt) {
      receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })
    }
    // get the image from get NFTmetadata
   // const contractAdd = receipt.logs[0].addresss;
   // const tokenId = receipt.logs[0].topics[3];
   // const metadata = async(contractAdd, tokenId) => {
       // const response = await web3.alchemy.getNftMetadata({
           // contractAddress: contractAddress,
           // tokenId: tokenId
       // })
  // }
   return {
     success: true,
     status:
      "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" +
      txHash + " https://testnets.opensea.io/assets/goerli/" + receipt.logs[0].address +"/"+ web3.utils.hexToNumber(receipt.logs[0].topics[3]),
      //url: metadata.media[0].raw,
    }
  } catch (error) {
   return {
    success: false,
    status: "😥 Something went wrong: " + error.message,
   }
 }
}

export const sonCreatePrayer = async (prayerType, prayer, prayer2, prayer3) => {
   window.contract = await new web3.eth.Contract(contractABI, contractAddress)
   const transactionParameters = {
     to: contractAddress, // Required except during contract publications.
     from: window.ethereum.selectedAddress, // must match user's active address.
     data: window.contract.methods
       .sonCreatePrayer(prayerType, prayer, prayer2, prayer3)
       .encodeABI(), //make call to NFT smart contract
   }

   //sign the transaction via MetaMask
   try {
     const txHash = await window.ethereum.request({
     method: "eth_sendTransaction",
     params: [transactionParameters],
   })
   return {
     success: true,
     status:
      "✅ New prayer is ready to be purchased: https://goerli.etherscan.io/tx/" +
      txHash,
    }
  } catch (error) {
   return {
    success: false,
    statusInit: "😥 Something went wrong: " + error.message,
   }
 }
}

export const payInitiation = async () => {
   window.contract = await new web3.eth.Contract(contractABI, contractAddress)
   //set up your Ethereum transaction 38D7EA4C68000
   const transactionParameters = {
     to: contractAddress, // Required except during contract publications.
     from: window.ethereum.selectedAddress, // must match user's active address.
     value: (100000000000000000).toString(16),
     data: window.contract.methods
       .payInitiation(window.ethereum.selectedAddress)
       .encodeABI(), //make call to NFT smart contract
   }
   
   //sign the transaction via MetaMask
   try {
     const txHash = await window.ethereum.request({
     method: "eth_sendTransaction",
     params: [transactionParameters],
   })
   return {
     success: true,
     status:
      "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
      txHash,
    }
  } catch (error) {
   return {
    success: false,
    statusAdd: "😥 Something went wrong: " + error.message,
   }
 }
}


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆 Type the number of times to read the single prayer.",
        }
      } else {
        return {
          address: "",
          status: "🦊 Connect to MetaMask using the top right button.",
        }
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      }
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    }
  }
}
