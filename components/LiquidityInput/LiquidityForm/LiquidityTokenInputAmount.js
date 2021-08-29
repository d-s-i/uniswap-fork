import React, { useEffect } from "react";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useButtonContext } from "../../../store/buttonMessage-context";

import web3 from "../../../ethereum/web3";
import router from "../../../ethereum/router";
import compiledUniswapV2Pair from "../../../ethereum/contracts/core/build/UniswapV2Pair.json";
import factory from "../../../ethereum/factory";
import { wethAddress } from "../../../ethereum/tokens/WETH";
import { convertWeiToEth, convertEthToWei } from "../../../helpers/functionsHelper";

import LiquiditySelectToken from "./LiquiditySelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./LiquidityTokenInputAmount.module.css";


const useStyles = makeStyles((theme) => ({
    liquidityBalance: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(0.5),
        fontSize: "1em"
    },
  }));

function LiquidityTokenInputAmount(props) {

    const liquidityContext = useAddLiquidityContext();
    const buttonContext = useButtonContext();

    const classes = useStyles();

    async function calculateCounterParty(amountInput, isFirstAmountCalculated) {
        try {
            const pairAddress = await factory.methods.getPair(liquidityContext.token0.address, "0xc778417E063141139Fce010982780140Aa0cD5Ab").call();
            if(pairAddress === "0x0000000000000000000000000000000000000000") {
                return props.id === "token0" ? liquidityContext.token1.amount : liquidityContext.token0.amount;
            }
            if(parseFloat(amountInput) !== 0) {
                const uniswapV2Pair = await new web3.eth.Contract(compiledUniswapV2Pair.abi, pairAddress);
                const reserves = await uniswapV2Pair.methods.getReserves().call();
                let reserve0, reserve1;
                if(parseInt(pairAddress, 16) > parseInt(wethAddress, 16)) { 
                    reserve1 = reserves[1]; 
                    reserve0 = reserves[0];
                } else {
                    reserve1 = reserves[0];
                    reserve0 = reserves[1];
                }
                const secondWeiAmount = await router.methods.quote(convertEthToWei(amountInput), reserve0, reserve1).call();
               return convertWeiToEth(secondWeiAmount);
            }
        } catch(error) {
            if(error.toString().includes("too many decimal places")) {
                buttonContext.onButtonChange("Too small number");
            }
            if(error.toString().includes("invalid number value")) {
                buttonContext.onButtonChange("Invalid number");
            }
        }
    }

    async function tokenAmountChangeHandler(event) {
        const enteredValue = event.target.value.slice(-1) === "," ? `${event.target.value.slice(0, -1)}.` : event.target.value;

        if(props.id === "token0") {
            liquidityContext.onToken0Change({ amount: enteredValue });
            if(!liquidityContext.token0.name) return;
            if(enteredValue.slice(-1) === "." || enteredValue === "0") return;
            if(enteredValue === "") {
                liquidityContext.onToken1Change({ amount: "" });
            }
            if(enteredValue !== "") {
                const token1Amount = await calculateCounterParty(enteredValue, false);
                liquidityContext.onToken1Change({ amount: token1Amount });
            }
        }
        if(props.id === "token1") {
            liquidityContext.onToken1Change({ amount: enteredValue });
            if(enteredValue.slice(-1) === "." || enteredValue === "0") return;
            if(enteredValue === "") {
                swapContext.onToken0Change({ amount: "" });
            }
            if(!liquidityContext.token0.name) return;
            if(enteredValue !== "") {
                const token0Amount = await calculateCounterParty(enteredValue, true);
                liquidityContext.onToken0Change({ amount: token0Amount });
            }
        }
    }

    async function setInputMaxBalances() {
        if(props.id === "token0") {
            liquidityContext.onToken0Change({ amount: liquidityContext.token0.balance });
            if(Number.isNaN(Number(liquidityContext.token0.balance))) return;
            if(
                liquidityContext.token0.balance !== "" 
                && liquidityContext.token0.balance.slice(-1) !== "." 
                && parseFloat(liquidityContext.token0.balance) !== 0
            ) {
                const token1Amount = await calculateCounterParty(liquidityContext.token0.balance, false);
                liquidityContext.onToken1Change({ amount: token1Amount });
            }
        }
        if(props.id === "token1") {
            liquidityContext.onToken1Change({ amount: liquidityContext.token1.balance });
            if(Number.isNaN(Number(liquidityContext.token1.balance))) return;
            if(
                liquidityContext.token1.balance !== "" 
                && liquidityContext.token1.balance.slice(-1) !== "." 
                && parseFloat(liquidityContext.token1.balance) !== 0
            ) {
                const token0Amount = await calculateCounterParty(liquidityContext.token1.balance, true);
                liquidityContext.onToken0Change({ amount: token0Amount });
            }
        }
    }

    useEffect(() => {
        async function calcOutput() {
            if(props.id === "token0") {
                if(liquidityContext.token0.amount !== "") {
                    const token1Amount = await calculateCounterParty(liquidityContext.token0.amount);
                    liquidityContext.onToken1Change({ amount: token1Amount });
                }
            }
        }
        calcOutput();
    }, [liquidityContext.token0.name])
    
    const amount = props.id === "token0" ? liquidityContext.token0.amount : liquidityContext.token1.amount;

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <LiquiditySelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input className={styles.input} value={amount ? amount.lenght > 8 ? Math.floor(amount * 100000000) / 100000000 : amount : ""} onChange={tokenAmountChangeHandler} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <div className={styles.displayBalances} >
                <Typography variant="subtitle1" className={classes.liquidityBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
                <button className={styles["max-button"]} onClick={setInputMaxBalances} >(Max)</button>
            </div>
        </div>
    );     
}

export default LiquidityTokenInputAmount;