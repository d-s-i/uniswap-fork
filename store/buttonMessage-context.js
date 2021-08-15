import { createContext, useContext, useState, useEffect } from 'react';
import { useSwapContext } from './swap-context';
import { useAddLiquidityContext } from "./addLiquidity-context"
import { checkRouterAllowance } from "../helpers/functionsHelper";

const ButtonContext = createContext();

export function ButtonContextProvider(props) {
    const swapContext = useSwapContext();
    const liquidityContext = useAddLiquidityContext();

    let defaultMessage;
    let token0Context, token1Context;

    if((swapContext.token0.name || swapContext.token1.name) && !liquidityContext.token0.name) {
        defaultMessage = "Swap";
        token0Context = swapContext.token0;
        token1Context = swapContext.token1;
    }
    if(liquidityContext.token0.name && !swapContext.token0.name && !swapContext.token1.name) {
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

        if(errorMessage) {
            message = errorMessage;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        if(!token0Context) return;
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
    
            if((isAllowed || token0Context.name === "BNB") && token0Context.amount !== "0" && token1Context.amount !== "0") {
                message = defaultMessage;
                setIsDisabled(false);
            }
            if(!isAllowed && token0Context.name !== "BNB") {
                message = `Approve ${token0Context.name}`;
                setIsDisabled(false);
            }
            if(!token0Context.amount ) {
                message = `Enter a ${token0Context.name} amount`;
            }
            if(!token1Context.amount) {
                message = `Enter a ${token1Context.name} amount`;
            }
        } catch(error) {
            message = "Invalid Input";
        }
        // if(errorMessage) {
        //     message = errorMessage;
        //     setButtonMessage(message);
        //     setIsDisabled(true);
        //     return;
        // }
        // if(swapContext.token0.amount === "" || swapContext.token1.amount === "" || swapContext.token0.amount === "0" || swapContext.token1.amount === "0") {
        //     message = "Start entering an amount";
        //     setButtonMessage(message);
        //     setIsDisabled(true);
        //     return;
        // }
        // if(Number.isNaN(Number(swapContext.token0.amount))) {
        //     message = `Please enter a valid ${swapContext.token0.name} amount`;
        //     setButtonMessage(message);
        //     setIsDisabled(true);
        //     return;
        // } 
        // if(Number.isNaN(Number(swapContext.token1.amount))) {
        //     message = `Please enter a valid ${swapContext.token1.name} amount`;
        //     setButtonMessage(message);
        //     setIsDisabled(true);
        //     return;
        // } 
        // if(swapContext.token0.name === swapContext.token1.name) {
        //     message = "Please, select two different tokens";
        //     setButtonMessage(message);
        //     setIsDisabled(true);
        //     return
        // }
        // try {
        //     const isAllowed = await checkRouterAllowance(swapContext.token0.name, swapContext.token0.amount);
    
        //     if((isAllowed || swapContext.token0.name === "BNB") && swapContext.token0.amount !== "0" && swapContext.token1.amount !== "0") {
        //         message = "Swap";
        //         setIsDisabled(false);
        //     }
        //     if(!isAllowed && swapContext.token0.name !== "BNB") {
        //         message = `Approve ${swapContext.token0.name}`;
        //         setIsDisabled(false);
        //     }
        //     if(!swapContext.token0.amount ) {
        //         message = `Enter a ${swapContext.token0.name} amount`;
        //     }
        //     if(!swapContext.token1.amount) {
        //         message = `Enter a ${swapContext.token1.name} amount`;
        //     }
        // } catch(error) {
        //     message = "Invalid Input";
        // }
        setButtonMessage(message);
    }
    useEffect(() => {
        // if(!Number.isNaN(parseFloat(swapContext.token0.amount)) && !Number.isNaN(parseFloat(swapContext.token1.amount))) {
            changeMessageHandler();
        // }
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
