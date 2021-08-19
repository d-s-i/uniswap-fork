import { createContext, useContext, useState } from 'react';

const SwapContext = createContext();

export function SwapContextProvider(props) {
    const [token0, setToken0] = useState({name: "", address: "", amount: "", focus: false, approved: false, balance: 0});
    const [token1, setToken1] = useState({name: "", address: "", amount: "", focus: false, approved: false, balance: 0});

    function token0ChangeHandler(tokenData) {
        setToken0((previousData) => ({...previousData, ...tokenData}));
    }
    function token1ChangeHandler(tokenData) {
        setToken1((previousData) => ({...previousData, ...tokenData}));
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