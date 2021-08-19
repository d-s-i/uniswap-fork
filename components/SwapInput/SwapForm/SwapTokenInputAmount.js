import React, { useEffect } from "react";
import { useSwapContext } from "../../../store/swap-context";
import { useButtonContext } from "../../../store/buttonMessage-context";

import { convertEthToWei, convertWeiToEth, getPaths, formalizeNumber } from "../../../helpers/functionsHelper";
import web3 from "../../../ethereum/web3";
import router from "../../../ethereum/router";
import compiledUniswapV2Pair from "../../../ethereum/contracts/core/build/UniswapV2Pair.json";
import factory from "../../../ethereum/factory";
import { wethAddress } from "../../../ethereum/tokens/WETH";

import SwapSelectToken from "./SwapSelectToken";
import { Typography, makeStyles, Button } from "@material-ui/core";

import styles from "./SwapTokenInputAmount.module.css";


const useStyles = makeStyles((theme) => ({
    swapBalance: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(0.5),
      fontSize: "1em"
    },
  }));

function SwapTokenInputAmount(props) {

    const swapContext = useSwapContext();
    const buttonContext = useButtonContext();

    const token0Address = swapContext.token0.address;
    const token1Address = swapContext.token1.address;
    const token0Amount = swapContext.token0.amount;
    const token1Amount = swapContext.token1.amount;

    const classes = useStyles();

    async function calculateAmountsOut(value) {
        try {
            const rawPaths = getPaths(token0Address, token1Address);

            const amountsOut = await router.methods.getAmountsOut(
                convertEthToWei(formalizeNumber(value)), 
                rawPaths
            ).call();
            const token1WeiAmount = amountsOut.slice(-1); 

            return convertWeiToEth(token1WeiAmount);
        } catch (error) {
            if(error.toString().includes("INSUFFICIENT_INPUT_AMOUNT")) {
                buttonContext.onButtonChange("Insuficient input amount");
                return;
            }
            if(!swapContext.token0.name) {
                buttonContext.onButtonChange("Please select a token");
            } else {
                buttonContext.onButtonChange("Insufficient liquidity for this trade");
            }
        }
    }

    async function calculateAmountsIn(value) {
        try {
            const rawPaths = getPaths(token0Address, token1Address);
                    
            const amountsIn = await router.methods.getAmountsIn(
                convertEthToWei(formalizeNumber(value)), 
                rawPaths
            ).call(); 

            const token0WeiAmount = amountsIn[0]; 
            return convertWeiToEth(token0WeiAmount);
        } catch(error) {
            if(error.code === 32603) {
                buttonContext.onButtonChange("Insuficient input amount");
                return;
            }
            if(!swapContext.token0.name) {
                buttonContext.onButtonChange("Please select a token");
            } else {
                buttonContext.onButtonChange("Insufficient liquidity for this trade");
            }
        }
    }

    async function tokenAmountChangeHandler(event) {

        const enteredValue = event.target.value.slice(-1) === "," ? `${event.target.value.slice(0, -1)}.` : event.target.value;
        
        if(props.id === "token0") {  
            console.log("goes into token0");
            swapContext.onToken0Change({ amount: enteredValue });

            if(enteredValue.slice(-1) === "." || parseFloat(enteredValue) === 0) return;
            console.log("goes after check . and === 0");
            if(enteredValue === "") {
                swapContext.onToken1Change({ amount: "" });
                console.log("goes into ''");
            }
            
            if(enteredValue !== "" && enteredValue.slice(-1) !== ".") {
                console.log("calculate amount out (last step)");
                const token1Amount = await calculateAmountsOut(enteredValue);
                swapContext.onToken1Change({ amount: token1Amount });
            }
        }
        if(props.id === "token1") {
            console.log(enteredValue);
            swapContext.onToken1Change({ amount: enteredValue });

            if(enteredValue.slice(-1) === "." || parseFloat(enteredValue) === 0) return;
            if(enteredValue === "") {
                swapContext.onToken1Change({ amount: "" });
            }
            
            if(enteredValue !== "" && enteredValue.slice(-1) !== ".") {
                const token0Amount = await calculateAmountsIn(enteredValue);
                swapContext.onToken0Change({ amount: token0Amount });
            }
        }
    }

    async function getAmountsOnExchangeToken() {
        if(swapContext.token0.focus) {  

            if(Number.isNaN(Number(token0Amount))) return;
            
            if(
                token0Amount !== "" 
                && token0Amount.slice(-1) !== "." 
                && parseFloat(token0Amount) !== 0
            ) {
                const token1Amount = await calculateAmountsOut(token0Amount);
                swapContext.onToken1Change({ amount: token1Amount });
            }
        }
        if(swapContext.token1.focus) {

            if(Number.isNaN(Number(token1Amount))) return;
            
            if(
                token1Amount !== "" 
                && token1Amount.slice(-1) !== "." 
                && parseFloat(token1Amount) !== 0
            ) {
                const token0Amount = await calculateAmountsIn(token1Amount);
                swapContext.onToken0Change({ amount: token0Amount });
            }
        }
    }

    useEffect(() => {
        getAmountsOnExchangeToken();
    }, [swapContext.token0.name, swapContext.token1.name])

    function focusHandler() {
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
            
            if(
                swapContext.token0.balance !== "" 
                && swapContext.token0.balance.slice(-1) !== "." 
                && parseFloat(swapContext.token0.balance) !== 0
            ) {
                const token1Amount = await calculateAmountsOut(swapContext.token0.balance);
                swapContext.onToken1Change({ amount: token1Amount });
            }
        }
        if(props.id === "token1") {
            focusHandler();
            swapContext.onToken1Change({ amount: swapContext.token1.balance });

            if(Number.isNaN(Number(swapContext.token1.balance))) return;
            
            if(
                swapContext.token1.balance !== "" 
                && swapContext.token1.balance.slice(-1) !== "." 
                && parseFloat(swapContext.token1.balance) !== 0
            ) {
                const token0Amount = await calculateAmountsIn(swapContext.token1.balance);
                swapContext.onToken0Change({ amount: token0Amount });
            }
        }
    }
    
    const amount = props.id === "token0" ? token0Amount : token1Amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SwapSelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input 
                    className={styles.input} 
                    value={amount} 
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
                <button className={styles["max-button"]} onClick={setInputMaxBalances} >(Max)</button>
            </div>
        </div>
    );     
}

export default SwapTokenInputAmount;