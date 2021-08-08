import React from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";

import web3 from "../../ethereum/web3";
import router from "../../ethereum/router";
import compiledUniswapV2Pair from "../../ethereum/contracts/core/build/UniswapV2Pair.json";
import factory from "../../ethereum/factory";
import { convertWeiToEth, convertEthToWei } from "../../helpers/functionsHelper";

import LiquiditySelectToken from "./LiquiditySelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./LiquidityTokenInputAmount.module.css";


const useStyles = makeStyles((theme) => ({
    liquidityBalance: {
      marginLeft: theme.spacing(1),
    },
  }));

function LiquidityTokenInputAmount(props) {

    const liquidityContext = useAddLiquidityContext();

    const classes = useStyles();

    async function tokenAmountChangeHandler(event) {
        const value = event.target.value;
        if(props.id === "token0") {
            liquidityContext.onToken0Change({ amount: value });
            if(value !== "") {
                try {
                    const pairAddress = await factory.methods.getPair(liquidityContext.token0.address, "0xc778417E063141139Fce010982780140Aa0cD5Ab").call();
                    if(pairAddress !== "0x0000000000000000000000000000000000000000") {
                        const uniswapV2Pair = await new web3.eth.Contract(compiledUniswapV2Pair.abi, pairAddress);
                        const reserves = await uniswapV2Pair.methods.getReserves().call();
                        const reserve0 = reserves[0];
                        const reserve1 = reserves[1];
                        const token1WeiAmount = await router.methods.quote(convertEthToWei(value), reserve0, reserve1).call();
                        const token1Amount = convertWeiToEth(token1WeiAmount);
                        liquidityContext.onToken1Change({ amount: token1Amount });
                    }
                } catch (error) {
                    console.log( error);
                }
            }
        }
        if(props.id === "token1") {
            liquidityContext.onToken1Change({ amount: value });
            if(value !== "") {
                try {
                    const pairAddress = await factory.methods.getPair(liquidityContext.token0.address, "0xc778417E063141139Fce010982780140Aa0cD5Ab").call(); // /!\ PROBLEM IF THERE IS NO TOKEN0 SELECTED !
                    if(pairAddress !== "0x0000000000000000000000000000000000000000") {
                        const uniswapV2Pair = await new web3.eth.Contract(compiledUniswapV2Pair.abi, pairAddress);
                        const reserves = await uniswapV2Pair.methods.getReserves().call();
                        const reserve0 = reserves[0];
                        const reserve1 = reserves[1];
                        const token0WeiAmount = await router.methods.quote(convertEthToWei(value), reserve1, reserve0).call();
                        const token0Amount = convertWeiToEth(token0WeiAmount);
                        liquidityContext.onToken0Change({ amount: token0Amount });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    
    const amount = props.id === "token0" ? liquidityContext.token0.amount : liquidityContext.token1.amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <LiquiditySelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input className={styles.input} value={/*amount ? amount.lenght > 4 ? amount : Math.floor(amount * 10000) / 10000 : ""*/ amount ? amount : ""} onChange={tokenAmountChangeHandler} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <Typography variant="subtitle1" className={classes.liquidityBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
        </div>
    );     
}

export default LiquidityTokenInputAmount;