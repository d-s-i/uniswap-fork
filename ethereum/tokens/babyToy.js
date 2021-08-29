import web3 from "../web3";
import BabyToy from "../contracts/periphery/build/BabyToy.json";

export const babyToyAddress = "0x782709eDd09763AdbaB618D11710645aB62737Ef";

export const babyToyData = {name: "BABYTOY", address: babyToyAddress};

const babyToy = new web3.eth.Contract(BabyToy.abi, babyToyAddress);

export default babyToy;