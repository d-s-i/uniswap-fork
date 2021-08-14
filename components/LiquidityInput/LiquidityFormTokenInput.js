import React, { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useAuthContext } from "../../store/auth-context";

import babyDoge from "../../ethereum/tokens/babyDoge";
import babyLeash from "../../ethereum/tokens/babyLeash";
import babyToy from "../../ethereum/tokens/babyToy";
import web3 from "../../ethereum/web3";

import LiquidityTokenInputAmount from "./LiquidityTokenInputAmount";

import { FormControl  } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import styles from "./LiquidityFormTokenInput.module.css";

function LiquidityFormTokenInput(props) {
    
    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();
    
    async function getBalances(tokenName) {
        if (authContext.accounts[0]) {
            const balanceAccount = await web3.eth.getAccounts();
            if(tokenName === "BABYDOGE") {
                const babyDogeWeiBalance = await babyDoge.methods.balanceOf(balanceAccount[0]).call();
                const babyDogeBalance = await web3.utils.fromWei(babyDogeWeiBalance.toString(), "ether");
                return parseFloat(babyDogeBalance).toFixed(2);
            }
            if(tokenName === "BABYTOY") {
                const babyToyWeiBalance = await babyToy.methods.balanceOf(balanceAccount[0]).call();
                const babyToyBalance = await web3.utils.fromWei(babyToyWeiBalance.toString(), "ether");
                return parseFloat(babyToyBalance).toFixed(2);
            }
            if(tokenName === "BABYLEASH") {
                const babyLeashWeiBalance = await babyLeash.methods.balanceOf(balanceAccount[0]).call();
                const babyLeashBalance = await web3.utils.fromWei(babyLeashWeiBalance.toString(), "ether");
                return parseFloat(babyLeashBalance).toFixed(2);
            }
            if(tokenName === "BNB") {
                const BnbBalances =  await web3.utils.fromWei(await web3.eth.getBalance(balanceAccount[0]), "ether");
                return (parseFloat(BnbBalances).toFixed(2));
            }
            // if(tokenName === "ETH") return await web3.eth.getBalances().call();
        }
    }

    useEffect(() => {
        async function updateBalances() {
            const balanceToken0 = await getBalances(liquidityContext.token0.name);
            const balanceToken1 = await getBalances("BNB");
            liquidityContext.onToken0Change({balance: balanceToken0});
            liquidityContext.onToken1Change({balance: balanceToken1});
            setBalancesToken0(balanceToken0);
            setBalancesToken1(balanceToken1); 
        }
        updateBalances();
    }, [liquidityContext.token0.name, liquidityContext.token1.name, authContext.accounts[0]]);
    
    return(
        <FormControl noValidate autoComplete="off">
            {!authContext.accounts[0] && <Typography variant="subtitle1" >Please connect to the Binance Smart Chain network</Typography>}
            <LiquidityTokenInputAmount id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            <LiquidityTokenInputAmount id="token1" name="token1" balances={balancesToken1} defaultToken={"BNB"} /> 
        </FormControl>
    );
}

export default LiquidityFormTokenInput;