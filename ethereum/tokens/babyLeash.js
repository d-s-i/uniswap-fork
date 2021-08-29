import web3 from "../web3";
import BabyLeash from "../contracts/periphery/build/BabyLeash.json";

export const babyLeashAddress = "0xD1F98f67BBDc0f1495618B604f47cb40fcD4EA3B";

export const babyLeashData = {name: "BABYLEASH", address: babyLeashAddress};

const babyLeash = new web3.eth.Contract(BabyLeash.abi, babyLeashAddress);

export default babyLeash;
