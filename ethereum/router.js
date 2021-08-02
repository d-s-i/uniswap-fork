import web3 from "./web3";
import UniswapV2Router02 from "./contracts/periphery/build/UniswapV2Router02.json";

const router = new web3.eth.Contract(UniswapV2Router02.abi, "0xE6ABe7A784cE8B31dD8e25A2aDA1B0E42835bcE0");

export default router;
