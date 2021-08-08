import web3 from "../web3";
import BabyDoge from "../contracts/periphery/build/BabyDoge.json";

export const babyDogeAddress = "0x76c51246641F711aAAe87C8Ef2C95da186798FB2";

export const babyDogeData = {name: "BABYDOGE", address: babyDogeAddress};

const babydoge = new web3.eth.Contract(BabyDoge.abi, babyDogeAddress);

export default babydoge;