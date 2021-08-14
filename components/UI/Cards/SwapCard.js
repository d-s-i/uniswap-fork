import React, { useState } from "react";

import { useSwapContext } from "../../../store/swap-context";
import { useButtonContext } from "../../../store/buttonMessage-context";

import router, { routerAddress } from "../../../ethereum/router";
import web3 from "../../../ethereum/web3";
import { convertEthToWei, getPaths, checkRouterAllowance, approveTokens, revokeTokens } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import SwapFormTokenInput from "../../SwapInput/SwapFormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";
import TransactionModal from "../Modal/TransactionModal";

import styles from "./SwapCard.module.css";

function SwapCard(props) {
    
    const swapContext = useSwapContext();
    const buttonContext = useButtonContext();
    const [isLoading, setIsLoading] = useState({state: false, message: ""});

    const slippage = 5/100;

    function closeModalHandler() {
        setIsLoading({state: false, message: ""});
    }

    // revokeTokens();

    async function swap() {
        const accounts = await web3.eth.getAccounts();
        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const isToken0Allowed = await checkRouterAllowance(swapContext.token0.name, swapContext.token0.amount);

        if(!isToken0Allowed && swapContext.token0.name !== "BNB") {
            setIsLoading({state: true, message: "Your transaction is being processed and your token will soon be approved"});
            await approveTokens(swapContext.token0.name);
            swapContext.onToken0Change({ approved : true });
            setIsLoading({state: false, message: ""});
            return;
        }

        if(swapContext.token0.focus) {

            if(swapContext.token0.name === swapContext.token1.name) return;
            if(swapContext.token0.name === "BNB") {
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                try {
                    await router.methods.swapExactETHForTokens(
                        `${amountOutMin}`, 
                        paths, 
                        accounts[0], 
                        deadline
                    ).send({ from: accounts[0], value: convertEthToWei(swapContext.token0.amount) }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                    console.log(error);
                }
            }
            if(swapContext.token1.name === "BNB") {
                
                const amountIn = convertEthToWei(swapContext.token0.amount);
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ;
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                try {
                    await router.methods.swapExactTokensForETH(
                        `${amountIn}`, 
                        `${amountOutMin}`, 
                        paths,
                        accounts[0],
                        deadline
                    ).send({ from: accounts[0] }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                }
            }
            if(swapContext.token0.name !== "BNB" && swapContext.token1.name !== "BNB") {
                const amountIn = convertEthToWei(swapContext.token0.amount);
                const amountOutMin = convertEthToWei(swapContext.token1.amount * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                try {
                    await router.methods.swapExactTokensForTokens(
                        `${amountIn}`, 
                        `${amountOutMin}`, 
                        paths, 
                        accounts[0], 
                        deadline
                    ).send({ from: accounts[0] }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                }
            }
        }
        if(swapContext.token1.focus) {
            if(swapContext.token0.name === swapContext.token1.name) return;
            if(swapContext.token0.name === "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                try {
                    await router.methods.swapETHForExactTokens(
                        `${amountOut}`,
                        paths,
                        accounts[0],
                        deadline    
                    ).send({ from: accounts[0], value: convertEthToWei(swapContext.token0.amount) }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                }
            }
            if(swapContext.token1.name === "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const amountInMax = convertEthToWei(swapContext.token0.amount * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                try {
                    await router.methods.swapTokensForExactETH(
                        `${amountOut}`,
                        `${amountInMax}`,
                        paths,
                        accounts[0],
                        deadline
                    ).send({ from: accounts[0] }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                }
            }
            if(swapContext.token0.name !== "BNB" && swapContext.token1.name !== "BNB") {
                const amountOut = convertEthToWei(swapContext.token1.amount);
                const amountInMax = convertEthToWei(swapContext.token0.amount * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);          

                try {
                    await router.methods.swapTokensForExactTokens(
                        `${amountOut}`,
                        `${amountInMax}`,
                        paths,
                        accounts[0],
                        deadline
                    ).send({ from: accounts[0] }).on("transactionHash", function(hash) {
                        setIsLoading({state: true, message: `Your swap is being processed here ${hash} Please wait.`});
                        }).once("confirmation", function(confirmationNumber, receipt) {
                            setIsLoading({state: true, message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`});
                    });
                } catch(error) {
                    setIsLoading({state: false, message: ""});
                }
            }
        }
    }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Swap</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{swapContext.token0.name && swapContext.token1.name ? `Exchange your ${swapContext.token0.name || "--"} for ${swapContext.token1.name || "--"}` : "Select a token"}</Typography>
            {isLoading.state && <TransactionModal onCloseModal={closeModalHandler} message={isLoading.message} />}
            <SwapFormTokenInput />
            <UserInputButton onClick={swap} disabled={buttonContext.isDisabled} message={buttonContext.message} />
        </div>
    );
}

export default SwapCard;