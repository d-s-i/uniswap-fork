import React, { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";
import { useAuthContext } from "../../store/auth-context";

import babyDoge from "../../ethereum/tokens/babyDoge";
import babyLeash from "../../ethereum/tokens/babyLeash";
import babyToy from "../../ethereum/tokens/babyToy";
import WETH from "../../ethereum/tokens/WETH";
import web3 from "../../ethereum/web3";

import TokenInputAmount from "./TokenInputAmount";

import { FormControl  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import Typography from "@material-ui/core/Typography";

import styles from "./FormTokenInput.module.css";

const useStyles = makeStyles({
    swapIcon: {
        color: "#0ab5db", 
        "&:hover": {cursor: "pointer"} 
    }
})

function FormTokenInput(props) {
    
    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const liquidityContext = useAddLiquidityContext();
    const swapContext = useSwapContext();
    const authContext = useAuthContext();

    const classes = useStyles();
    
    async function getBalances(tokenName) {
        if (authContext.accounts[0]) {
            const balanceAccount = await web3.eth.getAccounts();
            if(tokenName === "BABYDOGE") return await babyDoge.methods.balanceOf(authContext.accounts[0]).call();
            if(tokenName === "BABYTOY") return await babyToy.methods.balanceOf(authContext.accounts[0]).call();
            if(tokenName === "BABYLEASH") return await babyLeash.methods.balanceOf(authContext.accounts[0]).call();
            if(tokenName === "BNB") {
                const BnbBalances =  await web3.utils.fromWei(await web3.eth.getBalance(balanceAccount[0]), "ether");
                return (parseFloat(BnbBalances).toFixed(2));
            }
            // if(tokenName === "ETH") return await web3.eth.getBalances().call();
        }
    }

    useEffect(() => {
        async function test() {
            if(props.mode === "liquidity") {
                setBalancesToken0(await getBalances(liquidityContext.token0.name));
                setBalancesToken1(await getBalances("BNB")); 
            }
            if(props.mode === "swap") {                
                setBalancesToken0(await getBalances(swapContext.token0.name));
                setBalancesToken1(await getBalances(swapContext.token1.name)); 
            }
        }
        test();
    }, [liquidityContext.token0, liquidityContext.token1, swapContext.token0, swapContext.token1, authContext.accounts[0]]);

    function exchangeToken0WithToken1() {
        const storeExchange = swapContext.token0;
        swapContext.onToken0Change(swapContext.token1);
        swapContext.onToken1Change(storeExchange);
    }
    
    return(
        <FormControl noValidate autoComplete="off">
            {!authContext.accounts[0] && <Typography variant="subtitle1" >Please connect to the Binance Smart Chain network</Typography>}
            <TokenInputAmount mode={props.mode} id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            {props.mode === "swap" && <div className={styles.middle} ><SwapVerticalCircleIcon className={classes.swapIcon} onClick={exchangeToken0WithToken1} /></div>}
            <TokenInputAmount mode={props.mode} id="token1" name="token1" balances={balancesToken1} defaultToken={props.mode === "liquidity" ? "BNB" : ""} /> 
        </FormControl>
    );
}

export default FormTokenInput;