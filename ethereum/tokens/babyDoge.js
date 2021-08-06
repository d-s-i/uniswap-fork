import web3 from "../web3";
import BabyDoge from "../contracts/periphery/build/BabyDoge.json";

const babydoge = new web3.eth.Contract(BabyDoge.abi, "0x010b3D7055e53847480FDBdA62771c6D74C76453");

export default babydoge;