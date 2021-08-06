import { createContext, useContext, useState, useEffect } from 'react';
import web3, { connectWeb3Handler } from "../ethereum/web3";

const AuthContext = createContext();

export function AuthContextProvider(props) {
    const [accounts, setAccounts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function loginHandler() {
            connectWeb3Handler();
            const addresses = await web3.eth.getAccounts();
            setAccounts(addresses);
            setIsLoggedIn(true);
    }

    if(typeof(window) !== "undefined" && typeof(window.ethereum) !== "undefined") {
        useEffect(() => {
            window.ethereum.on('accountsChanged', function () {
                loginHandler();
            });
        }, [window.ethereum]);
    }

    let accountState = {
        isLoggedIn: isLoggedIn,
        accounts: accounts,
        onLogin: loginHandler
    };

    return (
        <AuthContext.Provider value={accountState}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}