import React, { useState } from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";

import { convertEthToWei, approveTokens, checkRouterAllowance, getDeadline, formalizeNumber, getTxUrl } from "../../helpers/functionsHelper";
import router from "../../ethereum/router";
import web3 from "../../ethereum/web3";

import LiquidityFormTokenInput from "./LiquidityForm/LiquidityFormTokenInput";
import UserInputButton from "../UI/Buttons/UserInputButton";
import TitleCard from "../UI/Cards/TitleCard";
import HandleTransactionCard from "../UI/Cards/HandleTransactionCard";
import TransactionLink from "../UI/TransactionLink";

import { Typography } from "@material-ui/core";

import styles from "./AddLiquidityUI.module.css";

function AddLiquidityUI(props) {

    const liquidityContext = useAddLiquidityContext();

    const [isLoading, setIsLoading] = useState({state: false, displayLoading: false, message: ""});

    const tokenName = liquidityContext.token0.name;
    const token0Amount = liquidityContext.token0.amount;
    const token1Amount = liquidityContext.token1.amount;

    const slippage = 50 / 100;

    async function addLiquidity() {
        const accounts = await web3.eth.getAccounts();

        const deadline = await getDeadline();

        const isRouterAllowed = await checkRouterAllowance(tokenName, token0Amount);

        if(isRouterAllowed && token0Amount !== 0) {
            await router.methods
                .addLiquidityETH(
                    `${liquidityContext.token0.address}`, 
                    `${convertEthToWei(`${formalizeNumber(token0Amount)}`)}`, 
                    `${convertEthToWei(`${formalizeNumber(token0Amount * (1 - slippage))}`)}`, // commented because  I have a problem, token0Amount is 1 wei when calculated from the quote function, so token0Amount*(1-slippage) === 0.5 wei ...
                    `${convertEthToWei(`${formalizeNumber(token1Amount * (1 - slippage))}`)}`,  // need to resolve the quote problem and getting a real value
                    accounts[0], 
                    deadline)
                .send({ 
                        from: accounts[0], 
                        value: convertEthToWei(token1Amount) 
                    })
                .on("transactionHash", function(hash) {
                        liquidityContext.onToken0Change({amount: ""});
                        liquidityContext.onToken1Change({amount: ""});
                        setIsLoading({state: true, displayLoading: true, message: <TransactionLink url={getTxUrl(hash)} firstPart="Your transaction is being processed here : " lastPart=" Please wait." /> });
                    })
                .once("confirmation", function(confirmationNumber, receipt) {
                        setIsLoading((prevState) => {
                            return {
                                ...prevState,
                                state: true, 
                                displayLoading: false, 
                                message: <TransactionLink url={getTxUrl(receipt.transactionHash)} firstPart="Your transaction have been confirmed! You can see all the details here : "  />
                            }
                        });
                    }); // AJOUTER DU SLIPPAGE DYNAMIQUE
        }
        if(isRouterAllowed !== undefined && !isRouterAllowed && parseFloat(token0Amount) !== 0) {
            await approveTokens(tokenName);
            liquidityContext.onToken0Change({ approved : true });
        }
    }

    function closeModalHandler() {
        setIsLoading((prevState) => {
            return {
                ...prevState,
                state: false, 
                displayIsLoading: false,
                message: ""
            };
        });
    }
    
    return(
        <React.Fragment>
            <div className={styles.top} >
                <TitleCard onRedirect={props.onRedirect} title="Add Liquidity" redirectionName="Swap" />
                <Typography style={{fontSize: "1.2em"}} variant="subtitle1">
                    {`Add liquidity for ${liquidityContext.token0.name || "--"}/${liquidityContext.token1.name || "--"} in the community liquidity pool!`}
                </Typography>
            </div>
            <div className={styles.main} >
                <LiquidityFormTokenInput />
                <UserInputButton onClick={addLiquidity} disabled={props.isDisabled} type="addLiquidity" message={props.buttonMessage} />
            </div>
            {isLoading.state && !isLoading.isError && <HandleTransactionCard onCloseModal={closeModalHandler} displayLoading={isLoading.displayLoading} >{isLoading.message}</HandleTransactionCard>}
        </React.Fragment>
    );
}

export default AddLiquidityUI;