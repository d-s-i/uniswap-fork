import web3 from "../web3";
import BabyLeash from "../contracts/periphery/build/BabyLeash.json";

const babyLeash = new web3.eth.Contract(BabyLeash.abi, "0x6E78d42cCe7E83FEBfE9ed3Bb5f3074A6eEE7e7c");

export default babyLeash;
