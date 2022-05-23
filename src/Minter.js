import { useEffect, useState } from "react";
import NumericInput from 'react-numeric-input';
import { connectWallet, getCurrentWalletConnected, orderPrayer, payInitiation, sonCreatePrayer } from "./utils/interact.js";
const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [statusInit, setStatusInit] = useState("");
  const [statusAdd, setStatusAdd] = useState("");
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
        setStatus("👆Select a number of times a single prayer will be prayed by a Soul Scroll")
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
      <p>
        Pick the number of times to have the generated prayer read, cost is 0.001 Eth per reading but only one NFT per request, then press "Pray for Me."
      </p>
      <form>
        <h2>✍️ Number of times prayer is read by Soul Scroll machines: </h2>
        <NumericInput
          min={0} max={77}
          onChange={(valueAsNumber) => setNumPrayerReadings(valueAsNumber)}
        />
      </form>
	<p>{(numPrayerReadings==0?.001:numPrayerReadings*.001).toFixed(3)}</p>
      <button id="mintButton" onClick={onMintPressed}>
        Pray for Me
      </button>
      <p id="status">
        {status}
      </p>
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
        <input
          type="text"
          placeholder="Enter type of prayer 14 characters (Health, Wealth, Ofred...)"
          onChange={(event) => setPrayerType(event.target.value)}
        />
       <h2>Prayer Line One</h2>
        <input
          type="text"
          placeholder="First Line of Prayer 58 character limit"
          onChange={(event) => setPrayer(event.target.value)}
        />
       <h2>Prayer Line Two</h2>
        <input
          type="text"
          placeholder="Second Line of Prayer 58 character limit"
          onChange={(event) => setPrayer2(event.target.value)}
        />
       <h2>Prayer Line Three</h2>
        <input
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

export default Minter;
