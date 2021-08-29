import web3 from "../web3";
import BabyDoge from "../contracts/periphery/build/BabyDoge.json";

export const babyDogeAddress = "0x0AE8dc31ECBD171B774e23Ab01680F1752927593";

export const babyDogeData = {name: "BABYDOGE", address: babyDogeAddress};

const babydoge = new web3.eth.Contract(BabyDoge.abi, babyDogeAddress);

export default babydoge;