import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, orderPrayer } from "./utils/interact.js";
const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [numPrayerReadings, setNumPrayerReadings] = useState("");
 
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
      <p>
        Pick the number of times to have the generated prayer read, cost is 0.001 Eth per reading but only one NFT per request, then press "Pray for Me."
      </p>
      <form>
        <h2>✍️ Number of times prayer is read by Soul Scroll machines: </h2>
        <input
          type="text"
          placeholder="10"
          onChange={(event) => setNumPrayerReadings(event.target.value)}
        />
      </form>
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
