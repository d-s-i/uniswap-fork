import web3 from "../web3";
import BabyToy from "../contracts/periphery/build/BabyToy.json";

export const babyToyAddress = "0x8B3E4f6c30Ad417A07A6504677BFfBd749440b50";

export const babyToyData = {name: "BABYTOY", address: babyToyAddress};

const babyToy = new web3.eth.Contract(BabyToy.abi, babyToyAddress);

export default babyToy;
