import { useEffect, useState } from "react";
import NumericInput from 'react-numeric-input';
import { connectWallet, getCurrentWalletConnected, orderPrayer, payInitiation, sonCreatePrayer } from "./utils/interact.js";
const Compose = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [statusInit, setStatusInit] = useState("");
  const [statusAdd, setStatusAdd] = useState("");
  const [url, setUrl] = useState("");
  const [numPrayerReadings, setNumPrayerReadings] = useState("");
  const [prayerType, setPrayerType] = useState("");
  const [prayer, setPrayer] = useState("");
  const [prayer2, setPrayer2] = useState("");
  const [prayer3, setPrayer3] = useState("");
 
  useEffect(async () => { 
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)

    addWalletListener()
  }, []);

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0])
        setStatus("👆Select a number of times a single prayer will be read out loud by a Soul Scroll")
      } else {
        setWallet("")
        setStatus("🦊 Connect to MetaMask using the top right button.")
      }
    })
  } else {
    setStatus(
      <p>
        {" "}
        🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install MetaMask, a virtual Ethereum wallet, in your browser.
        </a>
      </p>
    )
  }
}


  const connectWalletPressed = async () => { 
     const walletResponse = await connectWallet()
     setStatus(walletResponse.status)
     setWallet(walletResponse.address)
  };

  const onMintPressed = async () => {
     const { status } = await orderPrayer(numPrayerReadings)
     setStatus(status)
  };

  const onCreatePrayer = async () => {
     const { status } = await sonCreatePrayer(prayerType, prayer, prayer2, prayer3)
     setStatusAdd(status)
     setUrl(url)
     setPrayerType("")
     setPrayer("")
     setPrayer2("")
     setPrayer3("")
  };

  const onInitPressed = async () => {
     const { status } = await payInitiation()
     setStatusInit(status)
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Soul Scroll (aka Holy Roller)</h1>
      <h3>Soul Scroll, you might have called it a Holy Roller, is designed to act as a proxy for women to pray approved prayers of the Republic of Gilead out loud</h3>
<center>*************************************************</center>
      <p>Only pay initiation dues if you have been elected as a Commander. Please contact @soulscroll1 on Twitter</p>
      <button id="initButton" onClick={onInitPressed}>
        Pay Initiation Dues
      </button>
      <p id="status">
        {statusInit}
      </p>
<center>*************************************************</center>
      <h1>Write a prayer</h1>
      <p>If you are a Dues Paying Son of Jacob in Giliad create a prayer. You will recieve 75% of the sales. Prayer is sold once as an NFT and the suplicant will pick how many times it is read. The remaining 25% is to support Giliad and maintain the Soul Scroll machines.</p>
      <form>
       <h2>Prayer Type - Health, Wealth, Birth, Death, Sin</h2>
        <input name="prayerType" id="prayerType"
          type="text"
          placeholder="Enter type of prayer 14 characters (Health, Wealth, Ofred...)"
          onChange={(event) => setPrayerType(event.target.value)}
        />
       <h2>Prayer Line One</h2>
        <input name="prayer" id="prayer"
          type="text"
          placeholder="First Line of Prayer 58 character limit"
          onChange={(event) => setPrayer(event.target.value)}
        />
       <h2>Prayer Line Two</h2>
        <input name="prayer2" id="prayer2"
          type="text"
          placeholder="Second Line of Prayer 58 character limit"
          onChange={(event) => setPrayer2(event.target.value)}
        />
       <h2>Prayer Line Three</h2>
        <input name="prayer3" id="prayer3"
          type="text"
          placeholder="Third Line of Prayer 58 character limit"
          onChange={(event) => setPrayer3(event.target.value)}
        />
      </form>
      <p id="status">
        {statusAdd}
      </p>
      <button id="prayButton" onClick={onCreatePrayer}>
        Save Prayer
      </button>
    </div>
  );
};

export default Compose;
