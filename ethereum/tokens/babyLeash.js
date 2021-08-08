import web3 from "../web3";
import BabyLeash from "../contracts/periphery/build/BabyLeash.json";

export const babyLeashAddress = "0x257e145848a691bAb4720A23f65b40B8c5EC09D5";

export const babyLeashData = {name: "BABYLEASH", address: babyLeashAddress};

const babyLeash = new web3.eth.Contract(BabyLeash.abi, babyLeashAddress);

export default babyLeash;
