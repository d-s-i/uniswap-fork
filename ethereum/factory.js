import web3 from "./web3";
import UniswapV2Factory from "./contracts/core/build/UniswapV2Factory.json";

const factoryAddress = "0x92e13f53b3F1fb45549e76162995C5CAc43Bfb67";

const factory = new web3.eth.Contract(UniswapV2Factory.abi, factoryAddress);

export default factory;

export { factoryAddress };
