import web3 from "../ethereum/web3";

export function convertWeiToEth(amount) {
    return web3.utils.fromWei( `${amount}`, "ether");
}

export function convertEthToWei(amount) {
    return web3.utils.toWei(`${amount}`, "ether");
}