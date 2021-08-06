import React, { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useAuthContext } from "../../store/auth-context";

import babyDoge from "../../ethereum/tokens/babyDoge";
import babyLeash from "../../ethereum/tokens/babyLeash";
import babyToy from "../../ethereum/tokens/babyToy";
import WETH from "../../ethereum/tokens/WETH";
import web3 from "../../ethereum/web3";

import TokenInputAmount from "./TokenInputAmount";

import { FormControl  } from "@material-ui/core";

import styles from "./FormTokenInput.module.css";



function FormTokenInput(props) {

    
    const [balancesToken0, setBalancesToken0] = useState("");
    const [balancesToken1, setBalancesToken1] = useState("");
    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();
    
    async function getBalances(tokenName) {
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

    useEffect(() => {
        async function test() {
            setBalancesToken0(await getBalances(liquidityContext.token0.name));
            setBalancesToken1(await getBalances("BNB")); 
        }
        test();
    }, [liquidityContext.token0, liquidityContext.token1]);
    
    return(
        <FormControl noValidate autoComplete="off">
            <TokenInputAmount id="token0" name="token0" balances={balancesToken0} defaultToken={""} />
            <TokenInputAmount id="token1" name="token1" balances={balancesToken1} defaultToken={"BNB"} />
        </FormControl>
    );
}

export default FormTokenInput;