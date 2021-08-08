import web3 from "./web3";
import UniswapV2Router02 from "./contracts/periphery/build/UniswapV2Router02.json";

const routerAddress = "0xE6ABe7A784cE8B31dD8e25A2aDA1B0E42835bcE0";
const factoryAddress = "0x92e13f53b3F1fb45549e76162995C5CAc43Bfb67";

const router = new web3.eth.Contract(UniswapV2Router02.abi, routerAddress);

export default router;

export { routerAddress, factoryAddress };
