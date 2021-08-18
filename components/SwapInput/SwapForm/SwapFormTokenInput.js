import React, { useState, useEffect } from "react";
import { useSwapContext } from "../../../store/swap-context";
import { useAuthContext } from "../../../store/auth-context";

import babyDoge from "../../../ethereum/tokens/babyDoge";
import babyLeash from "../../../ethereum/tokens/babyLeash";
import babyToy from "../../../ethereum/tokens/babyToy";
import web3 from "../../../ethereum/web3";
import { convertWeiToEth, getBalances } from "../../../helpers/functionsHelper";

import SwapTokenInputAmount from "./SwapTokenInputAmount";

import { FormControl  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';

import styles from "./SwapFormTokenInput.module.css";

const useStyles = makeStyles({
    swapIcon: {
        color: "#0ab5db", 
        marginBottom: "4%",
        marginTop: "4%",
        "&:hover": {
            cursor: "pointer"
        } 
    },
    swapForm: {
        marginBottom: "10%",
        marginTop: "10%",
    }
});

function SwapFormTokenInput() {

    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const swapContext = useSwapContext();
    const authContext = useAuthContext();

    const classes = useStyles();

    useEffect(() => {
        async function updateBalances() {
            const balanceToken0 = await getBalances(swapContext.token0.name, authContext.accounts[0]);
            const balanceToken1 = await getBalances(swapContext.token1.name, authContext.accounts[0]);
            swapContext.onToken0Change({balance: balanceToken0});
            swapContext.onToken1Change({balance: balanceToken1});
            setBalancesToken0(balanceToken0);
            setBalancesToken1(balanceToken1); 
        }
        updateBalances();
    }, [swapContext.token0.name, swapContext.token1.name, authContext.accounts[0]]);

    function exchangeToken0WithToken1() {
        const storeExchange = swapContext.token0;
        swapContext.onToken0Change(swapContext.token1);
        swapContext.onToken1Change(storeExchange);
    }
    
    return(
        <FormControl className={classes.swapForm} noValidate autoComplete="off">
            <SwapTokenInputAmount id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            <div className={styles.middle} >
                <SwapVerticalCircleIcon className={classes.swapIcon} onClick={exchangeToken0WithToken1} />
            </div>
            <SwapTokenInputAmount id="token1" name="token1" balances={balancesToken1} defaultToken={""} /> 
        </FormControl>
    );
}

export default SwapFormTokenInput;