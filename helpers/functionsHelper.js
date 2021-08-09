import web3 from "../ethereum/web3";
import { wethAddress } from "../ethereum/tokens/WETH";

export function convertWeiToEth(amount) {
    return web3.utils.fromWei( `${amount}`, "ether");
}

export function convertEthToWei(amount) {
    return web3.utils.toWei(`${amount}`, "ether");
}

export function getPaths(token0Address, token1Address) {
    if(token0Address === wethAddress) return [wethAddress, token1Address];
    if(token1Address === wethAddress) return [token0Address, wethAddress];
    if(token0Address !== wethAddress && token1Address !== wethAddress) return [token0Address, wethAddress, token1Address];
}