import { createContext, useContext, useState, useEffect } from 'react';
import { useSwapContext } from './swap-context';
import { checkRouterAllowance } from "../helpers/functionsHelper";

const ButtonContext = createContext();

export function ButtonContextProvider(props) {
    const [buttonMessage, setButtonMessage] = useState("Swap");
    const [isDisabled, setIsDisabled] = useState(false);

    const swapContext = useSwapContext();

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
        if(swapContext.token0.amount === "" || swapContext.token1.amount === "" || swapContext.token0.amount === "0" || swapContext.token1.amount === "0") {
            message = "Start entering an amount";
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        }
        if(Number.isNaN(Number(swapContext.token0.amount))) {
            message = `Please enter a valid ${swapContext.token0.name} amount`;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        } 
        if(Number.isNaN(Number(swapContext.token1.amount))) {
            message = `Please enter a valid ${swapContext.token1.name} amount`;
            setButtonMessage(message);
            setIsDisabled(true);
            return;
        } 
        if(swapContext.token0.name === swapContext.token1.name) {
            message = "Please, select two different tokens";
            setButtonMessage(message);
            setIsDisabled(true);
            return
        }
        const isAllowed = await checkRouterAllowance(swapContext.token0.name, swapContext.token0.amount);

        if((isAllowed || swapContext.token0.name === "BNB") && swapContext.token0.amount !== "0" && swapContext.token1.amount !== "0") {
            message = "Swap";
            setIsDisabled(false);
        }
        if(!isAllowed && swapContext.token0.name !== "BNB") {
            message = `Approve ${swapContext.token0.name}`;
            setIsDisabled(false);
        }
        if(!swapContext.token0.amount ) {
            message = `Enter a ${swapContext.token0.name} amount`;
        }
        if(!swapContext.token1.amount) {
            message = `Enter a ${swapContext.token1.name} amount`;
        }
        setButtonMessage(message);
    }
    useEffect(() => {
        changeMessageHandler();
    }, [swapContext.token0, swapContext.token1]);

    return (
        <ButtonContext.Provider value={accountState}>
            {props.children}
        </ButtonContext.Provider>
    );
}

export function useButtonContext() {
    return useContext(ButtonContext);
}
