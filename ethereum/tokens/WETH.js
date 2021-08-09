import web3 from "../web3";
import WETH9 from "../contracts/periphery/build/WETH9.json";

export const wethAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const weth = new web3.eth.Contract(WETH9.abi, wethAddress);

export const bnbData = {name: "BNB", address: wethAddress};

export default weth;
