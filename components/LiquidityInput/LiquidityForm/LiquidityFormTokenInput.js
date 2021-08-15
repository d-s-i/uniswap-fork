import React, { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useAuthContext } from "../../../store/auth-context";

import { getBalances } from "../../../helpers/functionsHelper";

import LiquidityTokenInputAmount from "./LiquidityTokenInputAmount";

import { FormControl  } from "@material-ui/core";

import styles from "./LiquidityFormTokenInput.module.css";

function LiquidityFormTokenInput(props) {
    
    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();

    useEffect(() => {
        async function updateBalances() {
            const balanceToken0 = await getBalances(liquidityContext.token0.name, authContext.accounts[0]);
            const balanceToken1 = await getBalances("BNB", authContext.accounts[0]);
            liquidityContext.onToken0Change({balance: balanceToken0});
            liquidityContext.onToken1Change({balance: balanceToken1});
            setBalancesToken0(balanceToken0);
            setBalancesToken1(balanceToken1); 
        }
        updateBalances();
    }, [liquidityContext.token0.name, liquidityContext.token1.name, authContext.accounts[0]]);
    
    return(
        <FormControl noValidate autoComplete="off">
            <LiquidityTokenInputAmount id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            <LiquidityTokenInputAmount id="token1" name="token1" balances={balancesToken1} defaultToken={"BNB"} /> 
        </FormControl>
    );
}

export default LiquidityFormTokenInput;