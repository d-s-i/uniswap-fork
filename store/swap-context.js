import { createContext, useContext, useState } from 'react';

const SwapContext = createContext();

export function SwapContextProvider(props) {
    const [token0, setToken0] = useState({name: "", address: "", amount: "", focus: false, approved: false});
    const [token1, setToken1] = useState({name: "", address: "", amount: "", focus: false, approved: false});

    function token0ChangeHandler(token) {
        setToken0((previousData) => ({...previousData, ...token}));
    }
    function token1ChangeHandler(token) {
        setToken1((previousData) => ({...previousData, ...token}));
    }

    let accountState = {
        token0: token0,
        token1: token1,
        onToken0Change: token0ChangeHandler,
        onToken1Change: token1ChangeHandler,
    };

    return (
        <SwapContext.Provider value={accountState}>
            {props.children}
        </SwapContext.Provider>
    );
}

export function useSwapContext() {
    return useContext(SwapContext);
}