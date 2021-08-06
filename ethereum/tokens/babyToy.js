import web3 from "../web3";
import BabyToy from "../contracts/periphery/build/BabyToy.json";

const babyToy = new web3.eth.Contract(BabyToy.abi, "0xe150341e165379cbc8b5f5e0d46Eff220E318F45");

export default babyToy;
