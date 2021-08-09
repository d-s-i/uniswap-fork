import { useSwapContext } from "../../../store/swap-context";
import { useAuthContext } from "../../../store/auth-context";

import router from "../../../ethereum/router";
import web3 from "../../../ethereum/web3";
import { convertEthToWei, getPaths } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import SwapFormTokenInput from "../../SwapInput/SwapFormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./SwapCard.module.css";

function SwapCard(props) {

    const swapContext = useSwapContext();

    const slippage = 5/100;

    async function swap() {
        const accounts = await web3.eth.getAccounts();
        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

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
            <UserInputButton onClick={swap} message="Swap" />
        </div>
    );
}

export default SwapCard;