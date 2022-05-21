require("dotenv").config()
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(alchemyKey)

const contractABI = require("../SoulScroll.json")
//const contractAddress = "0xb3bDAa89E575418c670A70a7ebEF7838Afb5AC77"
const contractAddress = "0x468B10B1B1Fb91836eF38188CBECbcB025dA4850"

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
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
   //set up your Ethereum transaction
   const transactionParameters = {
     to: contractAddress, // Required except during contract publications.
     from: window.ethereum.selectedAddress, // must match user's active address.
     value: '38D7EA4C68000',
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
   return {
     success: true,
     status:
      "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
      txHash,
    }
  } catch (error) {
   return {
    success: false,
    status: "😥 Something went wrong: " + error.message,
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
