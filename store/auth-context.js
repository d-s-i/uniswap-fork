import { createContext, useContext, useState, useEffect } from 'react';
import web3, { connectWeb3Handler } from "../ethereum/web3";

const AuthContext = createContext();

export function AuthContextProvider(props) {
    const [accounts, setAccounts] = useState([]);
    const [isNetworkRight, setIsNetworkRight] = useState(true);

    async function loginHandler() {
            connectWeb3Handler();
            const addresses = await web3.eth.getAccounts();
            setAccounts(addresses);
    }

    if(typeof(window) !== "undefined" && typeof(window.ethereum) !== "undefined") {
        useEffect(() => {
            window.ethereum.on('accountsChanged', function () {
                loginHandler();
            });
            async function checkNetwork() {
                const network = await web3.eth.net.getNetworkType();

                if(network !== "rinkeby") {
                    setIsNetworkRight(false);
                } else {
                    setIsNetworkRight(true);
                }
            }
            checkNetwork();
        }, [window.ethereum]);
    }

    let accountState = {
        accounts: accounts,
        isNetworkRight: isNetworkRight,
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