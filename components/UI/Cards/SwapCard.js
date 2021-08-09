import React, { useEffect, useState } from "react";

import { useSwapContext } from "../../../store/swap-context";

import router from "../../../ethereum/router";
import web3 from "../../../ethereum/web3";
import { convertEthToWei, getPaths, checkRouterAllowance, approveTokens } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import SwapFormTokenInput from "../../SwapInput/SwapFormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./SwapCard.module.css";

function SwapCard(props) {

    const [buttonMessage, setButtonMessage] = useState("Swap");
    
    const swapContext = useSwapContext();

    const slippage = 5/100;

    useEffect(() => {
        async function changeMessageHandler() {
            const isToken0Allowed = await checkRouterAllowance(swapContext.token0.name);
            const isToken1Allowed = await checkRouterAllowance(swapContext.token1.name);
            const isAllowed = isToken0Allowed && isToken1Allowed;
            let message;

            if(isAllowed) {
                message = "Swap";
            }
            if(!isToken0Allowed) {
                message = `Approve ${swapContext.token0.name}`;
            }
            if(!isToken1Allowed) {
                message = `Approve ${swapContext.token1.name}`;
            }
            if(!swapContext.token0.amount) {
                message = `Enter a ${swapContext.token0.name} amount`;
            }
            if(!swapContext.token1.amount) {
                message = `Enter a ${swapContext.token1.name} amount`;
            }
            setButtonMessage(message);
        }
        changeMessageHandler();
    }, [swapContext.token0.name, swapContext.token1.name]);

    async function swap() {
        const accounts = await web3.eth.getAccounts();
        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const isToken0Allowed = await checkRouterAllowance(swapContext.token0.name);
        const isToken1Allowed = await checkRouterAllowance(swapContext.token1.name);

        if(!isToken0Allowed) {
            await approveTokens(swapContext.token0.name);
            swapContext.onToken0Change({ approved : true }); // await keyword removed
            return;
        }
        if(!isToken1Allowed) {
            await approveTokens(swapContext.token1.name);
            swapContext.onToken1Change({ approved : true }); // await keyword removed
            return;
        }

        if(swapContext.token0.focus) {
            if(swapContext.token0.name === swapContext.token1.name) return;
            if(swapContext.token0.name === "BNB") {
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                console.log("token0 name === BNB");
                await router.methods.swapExactETHForTokens(
                    `${Math.trunc(amountOutMin)}`, 
                    paths, 
                    accounts[0], 
                    deadline
                ).send({ from: accounts[0], value: convertEthToWei(swapContext.token0.amount) });
            }
            if(swapContext.token1.name === "BNB") {
                
                // APPROVED ???
                const amountIn = convertEthToWei(swapContext.token0.amount);
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ;
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);
                console.log("token1 name === BNB");

                await router.methods.swapExactTokensForETH(
                    `${amountIn}`, 
                    `${Math.trunc(amountOutMin)}`, 
                    paths,
                    accounts[0],
                    deadline
                ).send({ from: accounts[0] });
            }
            if(swapContext.token0.name !== "BNB" && swapContext.token1.name !== "BNB") {
                const amountIn = convertEthToWei(swapContext.token0.amount);
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);
                console.log(amountIn, amountOutMin);

                await router.methods.swapExactTokensForTokens(
                    `${amountIn}`, 
                    `${amountOutMin}`, 
                    paths, 
                    accounts[0], 
                    deadline
                ).send({ from: accounts[0] });
            }
        }
        if(swapContext.token1.focus) {
            if(swapContext.token0.name === swapContext.token1.name) return;
            if(swapContext.token0.name === "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                await router.methods.swapETHForExactTokens(
                    `${amountOut}`,
                    paths,
                    accounts[0],
                    deadline    
                ).send({ from: accounts[0], value: convertEthToWei(swapContext.token0.amount) });
            }
            if(swapContext.token1.name === "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const amountInMax = convertEthToWei(swapContext.token0.amount * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                await router.methods.swapTokensForExactETH(
                    `${amountOut}`,
                    `${amountInMax}`,
                    paths,
                    accounts[0],
                    deadline
                ).send({ from: accounts[0] });
            }
            if(swapContext.token0.name !== "BNB" && swapContext.token1.name !== "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const amountInMax = convertEthToWei(swapContext.token0.amount * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                await router.methods.swapTokensForExactTokens(
                    `${amountOut}`,
                    `${amountInMax}`,
                    paths,
                    accounts[0],
                    deadline
                ).send({ from: accounts[0] });
            }
        }
    }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Swap</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{`Exchange your ${swapContext.token0.name || "--"} for ${swapContext.token1.name || "--"}`}</Typography>
            <SwapFormTokenInput />
            <UserInputButton onClick={swap} message={buttonMessage} />
        </div>
    );
}

export default SwapCard;