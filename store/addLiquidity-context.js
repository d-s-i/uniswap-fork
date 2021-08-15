import { createContext, useContext, useState } from 'react';

const AddLiquidityContext = createContext();

export function AddLiquidityContextProvider(props) {
    const [token0, setToken0] = useState({name: "", address: "", amount: "", balance: 0, approved: false});
    const [token1, setToken1] = useState({name: "BNB", address: "", amount: "", balance: 0, approved: false});

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
        <AddLiquidityContext.Provider value={accountState}>
            {props.children}
        </AddLiquidityContext.Provider>
    );
}

export function useAddLiquidityContext() {
    return useContext(AddLiquidityContext);
}