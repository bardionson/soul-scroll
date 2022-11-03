import { useEffect, useState } from "react";
import NumericInput from 'react-numeric-input';
import { connectWallet, getCurrentWalletConnected, orderPrayer, payInitiation, sonCreatePrayer } from "./utils/interact.js";
const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [statusInit, setStatusInit] = useState("");
  const [statusAdd, setStatusAdd] = useState("");
  const [url, setUrl] = useState("");
  const [numPrayerReadings, setNumPrayerReadings] = useState("5");
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
  <div class="row">
  <div class="column">
    <div class="image">
      <img width="300" src="https://i0.wp.com/bardionson.com/wp-content/uploads/2022/11/soulScrollPoster4.png?w=576&ssl=1" alt="machinerack1"></img>
    </div>
  </div>
  <div class="column">
    <div class="image">
      <img width="300" src="https://i0.wp.com/bardionson.com/wp-content/uploads/2022/10/soulScrollPoster1.png?w=512&ssl=1" alt="ancientshelf"></img>
    </div>
  </div>
  <div class="column">
    <div class="image">
      <img width="300" src="https://i0.wp.com/bardionson.com/wp-content/uploads/2022/11/soulScrollPoster5.png?w=576&ssl=1" alt="modernrack"></img>
    </div>
  </div>
</div>
      <h3>Soul Scroll, you might have called it a Holy Roller, is designed to act as a proxy for women to pray approved prayers of the Republic of Gilead out loud</h3>
      <p>
        Pick the number of times to have the generated prayer read, cost is 0.001 Eth per reading but only one NFT per request, then press "Pray for Me."
      </p>
      <form>
        <h2>✍️ Number of times prayer is read by Soul Scroll machines: </h2>
        <NumericInput
          min={5} max={10}
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
    </div>
  );
};

export default Minter;
