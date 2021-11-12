import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  // state variable, used to store user's public wallet
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);
  const [totalWaves, setTotalWaves] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const contractAddress = "0x6Da1F31753f07B678a64C6f8645e75c18413F56C";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
      const {ethereum} = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let waves = await wavePortalContract.getAllWaves();

      let wavesArr = [];
      waves.forEach(wave => {
        wavesArr.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });

      // store data in React state
      setAllWaves(wavesArr);
  }

  const checkIfWalletIsConnected = async () => {
    try {
      // make sure we have access to window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
        getTotalWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

 const getTotalWaves = async () => {
   const {ethereum} = window;

   const provider = new ethers.providers.Web3Provider(ethereum);
   const signer = provider.getSigner();
   const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

   let waveCount = await wavePortalContract.getTotalWaves();
   console.log("Total waves: ", waveCount.toNumber());
   setTotalWaves(waveCount.toNumber());
 }

  // runs function when page loads
  React.useEffect (() => {
    checkIfWalletIsConnected();
  }, [])

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
      getTotalWaves();
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try{
      const {ethereum} = window;

      if (ethereum) {
        // talking to smartcontract from alchemy
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waveTxn = await wavePortalContract.wave(message, {gasLimit: 300000});
        await waveTxn.wait();

        getTotalWaves();
        getAllWaves();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const messageInputHandler = (e) => {
    setMessage(e.target.value);
  }

  const waveSubmitHandler = (e) => {
    document.getElementById("messageBox").value = '';
    setMessage("");
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Howdy!!
        </div>

        <div className="bio">
        Sorry can't talk right now. I'm doing  hot girl shit! #theeweb3hottie 😛
        </div>

        { currentAccount && (
          <div className="messageSubmit" onSubmit={waveSubmitHandler}>
            <form>
              <input type="text" className="messageBox" onChange={messageInputHandler}/>
            </form>

            <button type="submit" className="waveButton" onClick={wave}>
              Leave a message
            </button>
          </div>
        )}

        {/*} render the button if there's no account */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <div className="totalWaves">
          <h1> {totalWaves} Messages 🤯 </h1>
        </div>

        <div className="allWaves">
          {allWaves.map((wave, index) => {
              return (
                <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>
              )
            })}
        </div>

      </div>

      <div className="footer">
        <a href="https://github.com/ttran06">
          <img src={require("./github-square-brands.svg")}></img>
        </a>
        <a href="https://twitter.com/aphxd0r">
          <img src={require("./twitter-square-brands.svg")}></img>
        </a>
      </div>
    </div>
  );
}