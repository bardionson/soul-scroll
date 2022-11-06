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
        setStatus("👆Select a number of times a single prayer will be read out loud by a Soul Scroll minimum of 5 prayers max 10")
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
      <h1 id="title">Soul Scroll</h1>
      <h2>Approved by the Council of Elders of the Sons of Jacob</h2>
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
      <h3>God hears the prayers of the faithful. But only the elect can converse directly with our holiness.</h3>   
      <p>
        Pick the number of times to have the generated prayer read minimum of 5, cost is 0.01 Ethereum per reading but only one NFT per request, then press "Pray for Me."
      </p>
      <form>
        <p>✍️ Number of times prayer is read by Soul Scroll machines (min 5 | max 10): </p>
        <NumericInput
          min={5} max={10}
          onChange={(valueAsNumber) => setNumPrayerReadings(valueAsNumber)}
          onLoad={(valueAsNumber) => setNumPrayerReadings(valueAsNumber)}
        />
      </form>
	<p>{(numPrayerReadings==0?.01:numPrayerReadings*.01).toFixed(3)}</p>
      <button id="mintButton" onClick={onMintPressed}>
        Pray for Me
      </button>
      <p id="status">
        {status}
      </p>
      <p>Due to the shortage of men of the priesthood the Council has invented the Soul Scroll. Due to our limited knowledge of our God we send out the prayer on as many sensory and spiritual channels as possible in order to thwart the evil one. This enables women to submit requests for approved prayers and supplications authored by the most learned and holy men of the Republic. At times you may receive a prayer generated by an artificial intelligence model that was trained by Elder John and approved by proxy. Find out more at <a href='https://bardionson.com/soul-scroll-history/'>History of Soul Scroll</a></p>
      <p>For those new to this concept, when payment is made to the blockchain contract the machine will select a prayer. It will create an on-chain NFT, sending it to your wallet. It will print the prayer, read it out loud and inscribe it on to the blockchain. Optionally it may also live stream the performing of the prayer reading. <a href='https://etherscan.io/address/0xd44e37d09243a008ee1ae7838459d7faad9d250c'>The Prayer Contract</a></p>
       <p>(Soul Scroll, you might have called it a Holy Roller, is designed to act as a proxy for women to pray approved prayers of the Republic of Gilead out loud. Prayers generated may be offensive but they are based on prayers from The Handmaid's Tale and religious communities I have studied and  participated in.)</p>
    
    </div>
  );
};

export default Minter;
