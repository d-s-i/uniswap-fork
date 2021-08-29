import web3 from "../web3";
import YieldFarmingBabyDogeJson from "../contracts/migrator/build/YieldFarmingBabyDoge.json";

const yieldFarmingBabyDogeAddress = "0x4a23858e43495a346F2b21Fab58EE099c35de43b";

const yieldFarmingBabyDoge = new web3.eth.Contract(YieldFarmingBabyDogeJson.abi, yieldFarmingBabyDogeAddress);

export default yieldFarmingBabyDoge;

export { yieldFarmingBabyDogeAddress };