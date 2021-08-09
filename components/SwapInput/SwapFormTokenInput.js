import React, { useState, useEffect } from "react";
import { useSwapContext } from "../../store/swap-context";
import { useAuthContext } from "../../store/auth-context";

import babyDoge from "../../ethereum/tokens/babyDoge";
import babyLeash from "../../ethereum/tokens/babyLeash";
import babyToy from "../../ethereum/tokens/babyToy";
import web3 from "../../ethereum/web3";
import { convertWeiToEth } from "../../helpers/functionsHelper";

import SwapTokenInputAmount from "./SwapTokenInputAmount";

import { FormControl  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import Typography from "@material-ui/core/Typography";

import styles from "./SwapFormTokenInput.module.css";

const useStyles = makeStyles({
    swapIcon: {
        color: "#0ab5db", 
        "&:hover": {
            cursor: "pointer"
        } 
    }
});

function SwapFormTokenInput(props) {

    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const swapContext = useSwapContext();
    const authContext = useAuthContext();

    const classes = useStyles();
    
    async function getBalances(tokenName) {
        if (authContext.accounts[0]) {
            if(tokenName === "BABYDOGE") {
                const babyDogeWeiBalance = await babyDoge.methods.balanceOf(authContext.accounts[0]).call();
                const babyDogeBalance = convertWeiToEth(babyDogeWeiBalance.toString());
                return parseFloat(babyDogeBalance).toFixed(2);
            }
            if(tokenName === "BABYTOY") {
                const babyToyWeiBalance = await babyToy.methods.balanceOf(authContext.accounts[0]).call();
                const babyToyBalance = convertWeiToEth(babyToyWeiBalance.toString());
                return parseFloat(babyToyBalance).toFixed(2);
            }
            if(tokenName === "BABYLEASH") {
                const babyLeashWeiBalance = await babyLeash.methods.balanceOf(authContext.accounts[0]).call();
                const babyLeashBalance = convertWeiToEth(babyLeashWeiBalance.toString());
                return parseFloat(babyLeashBalance).toFixed(2);
            }
            if(tokenName === "BNB") {
                const BnbBalances =  convertWeiToEth(await web3.eth.getBalance(authContext.accounts[0]));
                return (parseFloat(BnbBalances).toFixed(2));
            }
        }
    }

    useEffect(() => {
        async function updateBalances() {
            setBalancesToken0(await getBalances(swapContext.token0.name));
            setBalancesToken1(await getBalances(swapContext.token1.name)); 
        }
        updateBalances();
    }, [swapContext.token0, swapContext.token1, authContext.accounts[0]]);

    function exchangeToken0WithToken1() {
        const storeExchange = swapContext.token0;
        swapContext.onToken0Change(swapContext.token1);
        swapContext.onToken1Change(storeExchange);
    }
    
    return(
        <FormControl noValidate autoComplete="off">
            {!authContext.accounts[0] && <Typography variant="subtitle1" >Please connect to the Binance Smart Chain network</Typography>}
            <SwapTokenInputAmount id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            <div className={styles.middle} >
                <SwapVerticalCircleIcon className={classes.swapIcon} onClick={exchangeToken0WithToken1} />
            </div>
            <SwapTokenInputAmount id="token1" name="token1" balances={balancesToken1} defaultToken={""} /> 
        </FormControl>
    );
}

export default SwapFormTokenInput;