import Web3 from "web3";
 //we e let keyword to be able to reassign the var web3
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/e408e54ff9c84e699ea382c9fddd418c"
  );
  web3 = new Web3(provider);
}
 
export default web3;