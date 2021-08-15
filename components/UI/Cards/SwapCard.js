import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useSwapContext } from "../../../store/swap-context";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useButtonContext } from "../../../store/buttonMessage-context";

import router from "../../../ethereum/router";
import web3 from "../../../ethereum/web3";
import { convertEthToWei, getPaths, checkRouterAllowance, approveTokens, formalizeNumber } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import Icon from '@material-ui/core/Icon';
import SwapFormTokenInput from "../../SwapInput/SwapFormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";
import TransactionModal from "../Modal/TransactionModal";
import ErrorModal from "../Modal/ErrorModal";
import HandleTransactionCard from "./HandleTransactionCard";
import SubCard from "./SubCard";

import styles from "./SwapCard.module.css";
import TitleCard from "./TitleCard";

function SwapCard() {
    
    const swapContext = useSwapContext();
    const liquidityContext = useAddLiquidityContext();
    const buttonContext = useButtonContext();
    const initialLoadingState = {state: false, displayLoading: false, message: "", isError: false};
    const [isLoading, setIsLoading] = useState(initialLoadingState);

    const token0Name = swapContext.token0.name;
    const token1Name = swapContext.token1.name;
    const token0Amount = swapContext.token0.amount;
    const token1Amount = swapContext.token1.amount;

    const slippage = 5 / 100;

    const router = useRouter();

    useEffect(() => {
        liquidityContext.onToken0Change({name: "", address: "", amount: "", balance: 0, approved: false});
    }, [])

    function closeModalHandler() {
        setIsLoading((prevState) => {
            return {
                ...prevState,
                ...initialLoadingState
            }
        });
    }

    async function handlePendingTransactionUI(transaction) {
        let blockHash;
        try {
            await transaction.on("transactionHash", function(hash) {
                blockHash = hash;
                swapContext.onToken0Change({amount: ""});
                swapContext.onToken1Change({amount: ""});
                setIsLoading((prevState) => {
                    return {
                        ...prevState,
                        state: true, 
                        isError: false, 
                        displayLoading: true,
                        message: `Your swap is being processed here ${hash} Please wait.`
                    }
                });
                }).once("confirmation", function(confirmationNumber, receipt) {
                    console.log(receipt);
                    setIsLoading((prevState) => {
                        return {
                            ...prevState,
                            state: true, 
                            isError: false, 
                            displayLoading: false,
                            message: `Your swap have been confirmed! You can see all the details here ${receipt.blockHash}.`
                        }
                    });
                });
                swapContext.onToken0Change({amount: ""});
                swapContext.onToken1Change({amount: ""});
        } catch (error) {
            if(error.code === 4001) return;
            setIsLoading((prevState) => {
                return {
                    ...prevState,
                    state: true, 
                    isError: true, 
                    message: `Your transaction failed ... Check ${blockHash} on etherscan and/or contact admins`
                }
            });
        }
    }

    async function swap() {
        const accounts = await web3.eth.getAccounts();
        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const isToken0Allowed = await checkRouterAllowance(token0Name, token0Amount);

        if(!isToken0Allowed && token0Name !== "BNB") {
            setIsLoading((prevState) => {
                return {
                    ...prevState,
                    state: true, 
                    isError: false, 
                    message: "Your transaction is being processed and your token will soon be approved"
                }
            });
            await approveTokens(token0Name);
            swapContext.onToken0Change({ approved : true });
            setIsLoading((prevState) => {
                return {
                    ...prevState,
                    state: false, 
                    isError: false, 
                    message: ""
                }
            });
            return;
        }

        if(swapContext.token0.focus) {

            if(token0Name === token1Name) return;
            if(token0Name === "BNB") {
                const amountOutMin = convertEthToWei(formalizeNumber(token1Amount) * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                handlePendingTransactionUI(router.methods.swapExactETHForTokens(
                    `${(amountOutMin)}`, 
                    paths, 
                    accounts[0], 
                    deadline
                ).send({ from: accounts[0], value: convertEthToWei(token0Amount) }));
            }
            if(token1Name === "BNB") {
                const amountIn = convertEthToWei(token0Amount);
                const amountOutMin = convertEthToWei(formalizeNumber(token1Amount * (1 - slippage))) ;
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                handlePendingTransactionUI(router.methods.swapExactTokensForETH(
                    `${amountIn}`, 
                    `${amountOutMin}`, 
                    paths,
                    accounts[0],
                    deadline
                ).send({ from: accounts[0] }));
            }
            if(token0Name !== "BNB" && token1Name !== "BNB") {
                const amountIn = convertEthToWei(token0Amount);
                const amountOutMin = convertEthToWei(formalizeNumber(token1Amount) * (1 - slippage)) ; 
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                handlePendingTransactionUI(
                    router.methods.swapExactTokensForTokens(
                        `${amountIn}`, 
                        `${amountOutMin}`, 
                        paths, 
                        accounts[0], 
                        deadline
                    ).send({ from: accounts[0] })
                );
            }
        }
        if(swapContext.token1.focus) {
            
            if(token0Name === token1Name) return;
            if(token0Name === "BNB") {
                const amountOut = convertEthToWei(token1Amount);
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                handlePendingTransactionUI(
                    router.methods.swapETHForExactTokens(
                        `${amountOut}`,
                        paths,
                        accounts[0],
                        deadline    
                    ).send({ from: accounts[0], value: convertEthToWei(token0Amount) })
                );
            }
            if(token1Name === "BNB") {
                const amountOut = convertEthToWei(token1Amount);
                const amountInMax = convertEthToWei(formalizeNumber(token0Amount) * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);

                handlePendingTransactionUI(
                    router.methods.swapTokensForExactETH(
                        `${amountOut}`,
                        `${amountInMax}`,
                        paths,
                        accounts[0],
                        deadline
                    ).send({ from: accounts[0] })
                );
            }
            if(token0Name !== "BNB" && token1Name !== "BNB") {
                const amountOut = convertEthToWei(token1Amount);
                const amountInMax = convertEthToWei(formalizeNumber(token0Amount) * (1 + slippage));
                const paths = getPaths(swapContext.token0.address, swapContext.token1.address);          

                handlePendingTransactionUI(
                    router.methods.swapTokensForExactTokens(
                        `${amountOut}`,
                        `${amountInMax}`,
                        paths,
                        accounts[0],
                        deadline
                    ).send({ from: accounts[0] })
                );
            }
        }
    }

    function liquidityRedirectHandler() {
        router.push("/liquidity");
    }

    return(
        <React.Fragment>
            <SubCard>
                <TitleCard onRedirect={liquidityRedirectHandler} title="Swap" redirectionName="Add Liquidity" />
                <Typography className={styles["card-subtitle"]} variant="subtitle1">{token0Name && token1Name ? `Exchange your ${token0Name || "--"} for ${token1Name || "--"}` : "Select a token"}</Typography>
                {/* {isLoading.state && !isLoading.isError && <TransactionModal onCloseModal={closeModalHandler} message={isLoading.message} />} */}
                {isLoading.state && isLoading.isError && <ErrorModal onCloseModal={closeModalHandler} message={isLoading.message} displayButton={true} />}
                <SwapFormTokenInput />
                <UserInputButton onClick={swap} disabled={buttonContext.isDisabled} message={buttonContext.message} />
            </SubCard>
            {isLoading.state && !isLoading.isError && <HandleTransactionCard displayLoading={isLoading.displayLoading} >{isLoading.message}</HandleTransactionCard>}
        </React.Fragment>
    );
}

export default SwapCard;