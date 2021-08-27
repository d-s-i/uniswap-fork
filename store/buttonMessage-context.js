import { createContext, useContext, useState, useEffect } from 'react';
import { useSwapContext } from './swap-context';
import { useAddLiquidityContext } from "./addLiquidity-context";
import { useAuthContext } from "./auth-context";
import { checkRouterAllowance } from "../helpers/functionsHelper";

const ButtonContext = createContext();

export function ButtonContextProvider(props) {
    const swapContext = useSwapContext();
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();

    let defaultMessage;
    let token0Context, token1Context;

    if((swapContext.token0.name || swapContext.token1.name) && !liquidityContext.token0.name) {
        defaultMessage = "Swap";
        token0Context = swapContext.token0;
        token1Context = swapContext.token1;
    }
    if(liquidityContext.token1.name && !swapContext.token0.name && !swapContext.token1.name) {
        defaultMessage = "Add Liquidity"
        token0Context = liquidityContext.token0;
        token1Context = liquidityContext.token1;
    }

    const [buttonMessage, setButtonMessage] = useState(defaultMessage || "Select a token");
    const [isDisabled, setIsDisabled] = useState(true);

    let accountState = { 
        message: buttonMessage, 
        isDisabled: isDisabled,
        onButtonChange: changeMessageHandler
    };


    async function changeMessageHandler(errorMessage) {
        let message;

        if(!authContext.accounts[0]) {
            message = "Please connect to the Rinkeby Network";
            setIsDisabled(true),
            setButtonMessage(message);
            return;
        }

        if(errorMessage) {
            message = errorMessage;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        if(!token0Context || token0Context.amount === undefined || token1Context.amount === undefined) return;
        if(token0Context.amount === "" || token1Context.amount === "" || token0Context.amount === "0" || token1Context.amount === "0") {
            message = "Start entering an amount";
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        if(Number.isNaN(Number(token0Context.amount))) {
            message = `Please enter a valid ${token0Context.name} amount`;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        } 
        if(Number.isNaN(Number(token1Context.amount))) {
            message = `Please enter a valid ${token1Context.name} amount`;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        } 
        if(token0Context.name === token1Context.name) {
            message = "Please, select two different tokens";
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        if(parseFloat(token1Context.amount) > parseFloat(token1Context.balance)) {
            message = "Insufficient balance";
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        try {
            const isAllowed = await checkRouterAllowance(token0Context.name, token0Context.amount);
    
            if((isAllowed || token0Context.name === "BNB") && token0Context.amount && token1Context.amount) {
                message = defaultMessage;
                setIsDisabled(false);
            }
            if(!isAllowed && token0Context.name !== "BNB") {
                message = `Approve ${token0Context.name}`;
                setIsDisabled(false);
            }
        } catch(error) {
            message = "Invalid amount";
        }
        setButtonMessage(message);
    }
    useEffect(() => {
        changeMessageHandler();
    }, [swapContext.token0, swapContext.token1, liquidityContext.token0, liquidityContext.token1]);

    return (
        <ButtonContext.Provider value={accountState}>
            {props.children}
        </ButtonContext.Provider>
    );
}

export function useButtonContext() {
    return useContext(ButtonContext);
}
