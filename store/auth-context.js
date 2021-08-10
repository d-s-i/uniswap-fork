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
            window.ethereum.on('networkChanged', function(networkId){
                console.log("in");
                console.log(typeof(networkId));
                if(networkId !== "4") {
                    setIsNetworkRight(false);
                } else {
                    setIsNetworkRight(true);
                }
              });
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