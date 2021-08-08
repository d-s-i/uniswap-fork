import React from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";

import router from "../../ethereum/router";
import compiledUniswapV2Pair from "../../ethereum/contracts/core/build/UniswapV2Pair.json";
import factory from "../../ethereum/factory";

import SwapSelectToken from "./SwapSelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./SwapTokenInputAmount.module.css";

import web3 from "../../ethereum/web3";
import { convertEthToWei, convertWeiToEth } from "../../helpers/functionsHelper";

const useStyles = makeStyles((theme) => ({
    swapBalance: {
      marginLeft: theme.spacing(1),
    },
  }));

function SwapTokenInputAmount(props) {

    const swapContext = useSwapContext();

    const classes = useStyles();

    async function tokenAmountChangeHandler(event) {
        const value = event.target.value;
        if(props.id === "token0") {
            swapContext.onToken0Change({amount: value});
            if(value !== "" && value.slice(-1) !== ".") {
                try {
                    const [,token1WeiAmount] = await router.methods.getAmountsOut(
                        convertEthToWei(value), 
                        [swapContext.token0.address, swapContext.token1.address]
                    ).call(); 
                    const token1Amount = convertWeiToEth(token1WeiAmount);
                    swapContext.onToken1Change({ amount: token1Amount });
                } catch (error) {
                    console.log(error);
                }
            }
        }
        if(props.id === "token1") {
            swapContext.onToken1Change({amount: value});
            if(value !== "") {
                try {
                    const [token0WeiAmount,] = await router.methods.getAmountsIn(
                        convertEthToWei(value), 
                        [swapContext.token0.address, swapContext.token1.address]
                    ).call();
                    const token0Amount = convertWeiToEth(token0WeiAmount);
                    swapContext.onToken0Change({ amount: token0Amount });
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }

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
    
    const amount = props.id === "token0" ? swapContext.token0.amount : swapContext.token1.amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SwapSelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input 
                    className={styles.input} 
                    value={/*amount ? amount.lenght > 4 ? amount : Math.floor(amount * 10000) / 10000 : ""*/ amount ? amount : ""} 
                    onFocus={focusHandler} 
                    onChange={tokenAmountChangeHandler} 
                    type="text" 
                    id={props.id}
                    name={props.name} 
                    placeholder="0.0" 
                />
            </div>
            <Typography variant="subtitle1" className={classes.swapBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
        </div>
    );     
}

export default SwapTokenInputAmount;