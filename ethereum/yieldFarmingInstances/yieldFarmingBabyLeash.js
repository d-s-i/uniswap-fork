import web3 from "../web3";
import YieldFarmingBabyLeashJson from "../contracts/migrator/build/YieldFarmingBabyLeash.json";

const yieldFarmingBabyLeashAddress = "0x60bbcd7a758231Ce9E3Ca7EdA22faA9F157947cc";

const yieldFarmingBabyLeash = new web3.eth.Contract(YieldFarmingBabyLeashJson.abi, yieldFarmingBabyLeashAddress);

export default yieldFarmingBabyLeash;

export { yieldFarmingBabyLeashAddress };