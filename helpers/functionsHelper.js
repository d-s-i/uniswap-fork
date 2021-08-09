import web3 from "../ethereum/web3";
import { wethAddress } from "../ethereum/tokens/WETH";
import { routerAddress } from "../ethereum/router";
import babyDoge from "../ethereum/tokens/babyDoge";
import babyToy from "../ethereum/tokens/babyToy";
import babyLeash from "../ethereum/tokens/babyLeash";

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

export async function checkRouterAllowance(tokenName, tokenAmount, account) {
    const accounts = await web3.eth.getAccounts();

    if(tokenName === "BABYDOGE") {
        const allowance = await babyDoge.methods.allowance(accounts[0], routerAddress).call();
        return parseFloat(allowance) > parseFloat(convertEthToWei(tokenAmount));
    }
    if(tokenName === "BABYTOY") {
        const allowance = await babyToy.methods.allowance(accounts[0], routerAddress).call();
        return parseFloat(allowance) > parseFloat(convertEthToWei(tokenAmount));
    }
    if(tokenName === "BABYLEASH") {
        const allowance = await babyLeash.methods.allowance(accounts[0], routerAddress).call();
        return parseFloat(allowance) > parseFloat(convertEthToWei(tokenAmount));
    }
}

export async function approveTokens(tokenName, account) {
    const infinite = BigInt(2**256) - BigInt(1);
    const accounts = await web3.eth.getAccounts();

    if(tokenName === "BABYDOGE") {
        await babyDoge.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
    }
    if(tokenName === "BABYTOY") {
        await babyToy.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
    }
    if(tokenName === "BABYLEASH") {
        await babyLeash.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
    }
}

// export async function revokeTokens() {
//     const accounts = await web3.eth.getAccounts();

//     await babyDoge.methods.approve(routerAddress, 0).send({ from: accounts[0] });
//     await babyToy.methods.approve(routerAddress, 0).send({ from: accounts[0] });
//     await babyLeash.methods.approve(routerAddress, 0).send({ from: accounts[0] });
// }
