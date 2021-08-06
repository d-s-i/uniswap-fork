"use-strict";

import Web3 from "web3";
 
let web3;

export function connectWeb3Handler() {
    if (typeof(window) !== "undefined" && typeof(window.ethereum) !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
    } else {
        const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/89a412d9ee7048108bbd76b077b7de05");
        web3 = new Web3(provider);
    }
}

connectWeb3Handler();
 
export default web3;