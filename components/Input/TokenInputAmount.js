import React from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";

import router from "../../ethereum/router";

import SelectToken from "./SelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./TokenInputAmount.module.css";
import web3 from "../../ethereum/web3";

const useStyles = makeStyles((theme) => ({
    liquidityBalance: {
      marginLeft: theme.spacing(1),
    },
  }));

function TokenInputAmount(props) {

    const liquidityContext = useAddLiquidityContext();
    const swapContext = useSwapContext();

    const classes = useStyles();

    async function tokenAmountChangeHandler(event) {
        const value = event.target.value;
        if(props.mode === "liquidity") {
            if(props.id === "token0") {
                liquidityContext.onToken0Change({amount: value});
            }
            if(props.id === "token1") {
                liquidityContext.onToken1Change({amount: value});
            }
        }
        if(props.mode === "swap") {
            if(props.id === "token0") {
                swapContext.onToken0Change({amount: value});
                if(value !== "" && value[-1] !== ".") {
                    const [,token1WeiAmount] = await router.methods.getAmountsOut(value, [swapContext.token0.address, swapContext.token1.address]).call(); // /!\ 18 decimals !! Convert to WEI VALUE !!
                    const token1Amount = web3.utils.fromWei(`${token1WeiAmount}`, "ether");
                    swapContext.onToken1Change({amount: parseFloat(token1Amount).toFixed(4)});
                }
            }
            if(props.id === "token1") {
                swapContext.onToken1Change({amount: value});
                if(value !== "" && value.slice(-1) !== "." && value.slice(-1) !== ",") {
                    try {
                        const amount = web3.utils.toWei(`${value}`, "ether");
                        const [token0WeiAmount,] = await router.methods.getAmountsIn(amount, [swapContext.token1.address, swapContext.token0.address]).call(); // /!\ 18 decimals !! Convert to WEI VALUE !!
                        // console.log(token0WeiAmount);
                        const token0Amount = web3.utils.fromWei(`${token0WeiAmount}`, "ether");
                        swapContext.onToken0Change({amount: parseFloat(token0Amount).toFixed(4)});
                    } catch(error) {
                        console.log(error);
                    }
                }
            }
        }
    }

    const amount = props.mode === "liquidity" ? props.id === "token0" ? liquidityContext.token0.amount : liquidityContext.token1.amount : props.id === "token0" ? swapContext.token0.amount : swapContext.token1.amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input className={styles.input} value={amount} onChange={tokenAmountChangeHandler} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <Typography variant="subtitle1" className={classes.liquidityBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
        </div>
    );     
}

export default TokenInputAmount;