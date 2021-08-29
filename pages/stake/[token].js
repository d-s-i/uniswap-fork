import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import web3 from "../../ethereum/web3";

import compiledIUniswapV2Pair from "../../ethereum/contracts/core/build/IUniswapV2Pair.json";
import babyToy from "../../ethereum/tokens/babyToy";
import babyLeash from "../../ethereum/tokens/babyLeash";
import yieldFarmingBabyDoge, { yieldFarmingBabyDogeAddress } from "../../ethereum/yieldFarmingInstances/yieldFarmingBabyDoge";
import yieldFarmingBabyLeash, { yieldFarmingBabyLeashAddress } from "../../ethereum/yieldFarmingInstances/yieldFarmingBabyLeash";
import { BabyLeashLpTokenAddress, BabyDogeLpTokenAddress } from "../../ethereum/tokens/LPTokenInstance";
import { convertWeiToEth } from "../../helpers/functionsHelper";

function babyDoge() {

    const [token, setToken] = useState({
        name: "",
        yieldFarmingAddress: "",
        yieldFarmingContracts: "",
        lpTokenContract: "",
        balances: "",
        depositedAmount: "",
        claimableRewards: "",
        bonusTokenBalance: "",
    });
    const router = useRouter();

    useEffect(() => {
        async function getTokenState() {
            if(!router.isReady) return;
            const accounts = await web3.eth.getAccounts();
            
            if(router.query.token === "babyDoge") {
                console.log("runnin babyDoge :D")
                const lpToken = await new web3.eth.Contract(compiledIUniswapV2Pair.abi, BabyDogeLpTokenAddress);
                const rewards = await yieldFarmingBabyDoge.methods.calculateYieldTotal(accounts[0]).call();
                const balances = await lpToken.methods.balanceOf(accounts[0]).call();
                const depositedAmount = await yieldFarmingBabyDoge.methods.depositedAmount(accounts[0]).call();
                const bonusTokenBalance = await babyLeash.methods.balanceOf(accounts[0]).call();
                
                setToken((prevState) => {
                    return {
                        ...prevState,
                        name: "BabyDoge",
                        yieldFarmingAddress: yieldFarmingBabyDogeAddress,
                        yieldFarmingContract: yieldFarmingBabyDoge,
                        lpTokenContract: lpToken,
                        balances: balances,
                        depositedAmount: depositedAmount,
                        claimableRewards: rewards,
                        bonusTokenBalance: bonusTokenBalance
                    }
                });
            }
            if(router.query.token === "babyLeash") {
                console.log("runnin babyLeash :D");
                const lpToken = await new web3.eth.Contract(compiledIUniswapV2Pair.abi, BabyLeashLpTokenAddress);
                const rewards = await yieldFarmingBabyLeash.methods.calculateYieldTotal(accounts[0]).call();
                const balances = await lpToken.methods.balanceOf(accounts[0]).call();
                const depositedAmount = await yieldFarmingBabyLeash.methods.depositedAmount(accounts[0]).call();
                const bonusTokenBalance = await babyToy.methods.balanceOf(accounts[0]).call();

                setToken((prevState) => {
                    return {
                        ...prevState,
                        name: "BabyLeash",
                        yieldFarmingAddress: yieldFarmingBabyLeashAddress,
                        yieldFarmingContract: yieldFarmingBabyLeash,
                        lpTokenContract: lpToken,
                        balances: balances,
                        depositedAmount: depositedAmount,
                        claimableRewards: rewards,
                        bonusTokenBalance: bonusTokenBalance
                    }
                });
            }
        }
        getTokenState();
    }, [router.isReady]);

    function displayWeiToEthWitDecimals(number) {
        return parseFloat(convertWeiToEth(number)).toFixed(4);
    }

    async function approveStakeHandler() {
        const infinite = BigInt(2**256) - BigInt(1);
        const accounts = await web3.eth.getAccounts();
        console.log(await token.lpTokenContract.methods.balanceOf(accounts[0]).call());

        await token.lpTokenContract.methods.approve(token.yieldFarmingAddress, infinite).send({ from: accounts[0] });
    }
    
    async function onStakeHandler() {
        const accounts = await web3.eth.getAccounts();
        const liquidityAmount = await token.lpTokenContract.methods.balanceOf(accounts[0]).call();
        console.log(liquidityAmount);
        await token.yieldFarmingContract.methods.stake(liquidityAmount).send({ from: accounts[0] });
    }

    async function unstakeHandler() {
        const accounts = await web3.eth.getAccounts();
        const realAmountYieldContractHolding = await token.lpTokenContract.methods.balanceOf(token.yieldFarmingAddress).call();
        console.log("realLpTokenAmount contract holding: ", realAmountYieldContractHolding);
        const lpTokenAmountDeposited = await token.yieldFarmingContract.methods.depositedAmount(accounts[0]).call();
        console.log("depositedAmount variable: ",lpTokenAmountDeposited);
        // const isStaking = await token.yieldFarmingContract.methods.isStaking(accounts[0]).call();
        // console.log("isStaking: ",isStaking)
        console.log(await babyLeash.methods.allowedMinter().call());

        // await token.yieldFarmingContract.methods.withdrawRewards().send({ from: accounts[0] });
        await token.yieldFarmingContract.methods.unstake(BigInt(lpTokenAmountDeposited)).send({ from: accounts[0] });
    }

    // async function setLiquidator() {
    //     const accounts = await web3.eth.getAccouts();

    //     await token.lpTokenContract.methods
    // }

    // montrer le nombre de LP token staked (plutôt le nombre de token0 et token1 que cela représente)
    // claim button
    // unstake button
    // unstake + claim button
    
    return(
        <div>
            <p>{`here you can stake your ${token.name}-BNB position :D`}</p>
            <button onClick={onStakeHandler} >stake!</button>
            <button onClick={approveStakeHandler} >approve stake!</button>
            <button onClick={unstakeHandler} >unstake!</button>
            <p>{`Claimable Rewards: ${convertWeiToEth(token.claimableRewards)} BabyToy`}</p>
            <p>{`Amount deposited : ${displayWeiToEthWitDecimals(token.depositedAmount)} ${token.name}-BNB LP tokens`}</p>
            <p>{`LP balances on your address: ${displayWeiToEthWitDecimals(token.balances)} ${token.name}-BNB LP tokens`}</p>
            <p>{`BonusToken balances on your address: ${displayWeiToEthWitDecimals(token.bonusTokenBalance)} BonusToken`}</p>
        </div>
    );
}

export default babyDoge;