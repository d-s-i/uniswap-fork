import React, { useEffect } from "react";
import { useSwapContext } from "../../store/swap-context";
import { useButtonContext } from "../../store/buttonMessage-context";

import { convertEthToWei, convertWeiToEth, getPaths } from "../../helpers/functionsHelper";
import web3 from "../../ethereum/web3";
import router from "../../ethereum/router";
import compiledUniswapV2Pair from "../../ethereum/contracts/core/build/UniswapV2Pair.json";
import factory from "../../ethereum/factory";
import { wethAddress } from "../../ethereum/tokens/WETH";

import SwapSelectToken from "./SwapSelectToken";
import { Typography, makeStyles, Button } from "@material-ui/core";

import styles from "./SwapTokenInputAmount.module.css";


const useStyles = makeStyles((theme) => ({
    swapBalance: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }));

function SwapTokenInputAmount(props) {

    const swapContext = useSwapContext();
    const buttonContext = useButtonContext();

    const classes = useStyles();

    async function tokenAmountChangeHandler(event) {
        async function checkInput(input) {
            if(input.slice(-1) === ",") return(`${input.slice(0, -1)}.`);
            if(input === "0") {
                swapContext.onToken0Change({ amount: "" });
                swapContext.onToken1Change({ amount: "" });
                return;
            }
            return input;
        }

        const enteredValue = await checkInput(event.target.value);
        
        if(props.id === "token0") {  
            swapContext.onToken0Change({ amount: enteredValue });
            if(Number.isNaN(Number(enteredValue))) return;
            if(enteredValue !== "" && enteredValue.slice(-1) !== "." && parseFloat(enteredValue) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);

                    const amountsOut = await router.methods.getAmountsOut(
                        convertEthToWei(enteredValue), 
                        rawPaths
                    ).call(); 
                    const token1WeiAmount = amountsOut.slice(-1); 

                    const token1Amount = convertWeiToEth(token1WeiAmount);
                    swapContext.onToken1Change({ amount: token1Amount });
                } catch (error) {
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
        if(props.id === "token1") {
            swapContext.onToken1Change({ amount: enteredValue });
            if(Number.isNaN(Number(enteredValue))) return;
            if(enteredValue !== "" && enteredValue.slice(-1) !== "." && parseFloat(enteredValue) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);
                    
                    const amountsIn = await router.methods.getAmountsIn(
                        convertEthToWei(enteredValue), 
                        rawPaths
                    ).call(); 

                    const token0WeiAmount = amountsIn[0]; 
                    const token0Amount = convertWeiToEth(token0WeiAmount);
                    swapContext.onToken0Change({ amount: token0Amount });
                } catch(error) {
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
    }

    async function getAmountsOnExchangeToken() {
        if(swapContext.token0.focus) {  
            if(Number.isNaN(Number(swapContext.token0.amount))) return;
            if(swapContext.token0.amount !== "" && swapContext.token0.amount.slice(-1) !== "." && parseFloat(swapContext.token0.amount) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);

                    const amountsOut = await router.methods.getAmountsOut(
                        convertEthToWei(swapContext.token0.amount), 
                        rawPaths
                    ).call(); 
                    const token1WeiAmount = amountsOut.slice(-1); 

                    const token1Amount = convertWeiToEth(token1WeiAmount);
                    swapContext.onToken1Change({ amount: token1Amount });
                } catch (error) {
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
        if(swapContext.token1.focus) {
            if(Number.isNaN(Number(swapContext.token1.amount))) return;
            if(swapContext.token1.amount !== "" && swapContext.token1.amount.slice(-1) !== "." && parseFloat(swapContext.token1.amount) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);
                    
                    const amountsIn = await router.methods.getAmountsIn(
                        convertEthToWei(swapContext.token1.amount), 
                        rawPaths
                    ).call(); 

                    const token0WeiAmount = amountsIn[0]; 
                    const token0Amount = convertWeiToEth(token0WeiAmount);
                    swapContext.onToken0Change({ amount: token0Amount });
                } catch(error) {
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
    }

    useEffect(() => {
        getAmountsOnExchangeToken();
    }, [swapContext.token0.name, swapContext.token1.name])

    function focusHandler() {
        if(buttonContext.isDisabled) return;
        if(props.id === "token0") {
            swapContext.onToken0Change({ focus: true });
            swapContext.onToken1Change({ focus: false });
        }
        if(props.id === "token1") {
            swapContext.onToken0Change({ focus: false });
            swapContext.onToken1Change({ focus: true });
        }
    }
    
    async function setInputMaxBalances() {
        if(props.id === "token0") {
            focusHandler();
            swapContext.onToken0Change({ amount: swapContext.token0.balance });
            if(Number.isNaN(Number(swapContext.token0.balance))) return;
            if(swapContext.token0.balance !== "" && swapContext.token0.balance.slice(-1) !== "." && parseFloat(swapContext.token0.balance) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);
    
                    const amountsOut = await router.methods.getAmountsOut(
                        convertEthToWei(swapContext.token0.balance), 
                        rawPaths
                    ).call(); 
                    const token1WeiAmount = amountsOut.slice(-1); 
    
                    const token1Amount = convertWeiToEth(token1WeiAmount);
                    swapContext.onToken1Change({ amount: token1Amount });
                } catch (error) {
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
        if(props.id === "token1") {
            focusHandler();
            swapContext.onToken1Change({ amount: swapContext.token1.balance });
            if(Number.isNaN(Number(swapContext.token1.balance))) return;
            if(swapContext.token1.balance !== "" && swapContext.token1.balance.slice(-1) !== "." && parseFloat(swapContext.token1.balance) !== 0) {
                try {
                    const rawPaths = getPaths(swapContext.token0.address, swapContext.token1.address);

                    const amountsIn = await router.methods.getAmountsIn(
                        convertEthToWei(swapContext.token1.balance), 
                        rawPaths
                    ).call(); 
    
                    const token0WeiAmount = amountsIn[0]; 
                    const token0Amount = convertWeiToEth(token0WeiAmount);
                    swapContext.onToken0Change({ amount: token0Amount });
                } catch(error) {
                    // if(error.message.includes("underflow")) {
                    // }
                    buttonContext.onButtonChange("Insufficient liquidity for this trade");
                }
            }
        }
    }
    
    const amount = props.id === "token0" ? swapContext.token0.amount : swapContext.token1.amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SwapSelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input 
                    className={styles.input} 
                    value={amount ? amount.length > 8 ? Math.floor(amount * 1000000) / 1000000 : amount : ""} 
                    onFocus={focusHandler} 
                    onChange={tokenAmountChangeHandler}
                    type="text" 
                    id={props.id}
                    name={props.name} 
                    placeholder="0.0" 
                />
            </div>
            <div className={styles.displayBalances} >
                <Typography variant="subtitle1" className={classes.swapBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
                <button className={styles["max-button"]} onClick={setInputMaxBalances} >Max</button>
            </div>
        </div>
    );     
}

export default SwapTokenInputAmount;