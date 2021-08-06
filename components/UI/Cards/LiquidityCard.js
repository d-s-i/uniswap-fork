import { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useAuthContext } from "../../../store/auth-context";

import web3 from "../../../ethereum/web3";
import router, { routerAddress } from "../../../ethereum/router";
import babyDoge from "../../../ethereum/tokens/babyDoge";
import babyToy from "../../../ethereum/tokens/babyToy";
import babyLeash from "../../../ethereum/tokens/babyLeash";

import Typography from "@material-ui/core/Typography";
import FormTokenInput from "../../Input/FormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./LiquidityCard.module.css";

const ethToWei = (ethAmount) => web3.utils.toWei(`${ethAmount}`, "ether");

function LiquidityCard(props) {

    const [buttonMessage, setButtonMessage] = useState("Add Liquidity");

    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();
    
    useEffect(() => {
        async function changeMessageHandler() {
            const message = await checkAllowance(liquidityContext.token0.name) ? "Add Liquidity" : `Approve ${liquidityContext.token0.name}`;
            setButtonMessage(message);
        }
        changeMessageHandler();
    }, [liquidityContext.token0])


    async function checkAllowance(token) {
        if(token === "BABYDOGE") {
            const allowance = await babyDoge.methods.allowance(authContext.accounts[0], routerAddress).call();
            return allowance > liquidityContext.token0.amount;
        }
        if(token === "BABYTOY") {
            const allowance = await babyToy.methods.allowance(authContext.accounts[0], routerAddress).call();
            return allowance > liquidityContext.token0.amount;
        }
        if(token === "BABYLEASH") {
            const allowance = await babyLeash.methods.allowance(authContext.accounts[0], routerAddress).call();
            return allowance > liquidityContext.token0.amount;
        }
    }
    

    async function addLiquidity() {
        const accounts = await web3.eth.getAccounts();

        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const tokenName = liquidityContext.token0.name;
        const token0Amount = liquidityContext.token0.amount;
        const allowed = await checkAllowance(tokenName);

        if(allowed && parseFloat(token0Amount) !== 0) {
            await router.methods
            .addLiquidityETH(`${liquidityContext.token0.address}`, `${liquidityContext.token0.amount}`, `${liquidityContext.token0.amount}`, ethToWei(liquidityContext.token1.amount), accounts[0], deadline)
            .send({ from: accounts[0], value: ethToWei(liquidityContext.token1.amount) });
        }
        if(!allowed && parseFloat(token0Amount) !== 0) {
            if(tokenName === "BABYDOGE") {
                babyDoge.methods.approve(routerAddress, 2^256 - 1).send({ from: accounts[0] });
            }
            if(tokenName === "BABYTOY") {
                babyToy.methods.approve(routerAddress, 2^256 - 1).send({ from: accounts[0] });
            }
            if(tokenName === "BABYLEASH") {
                babyLeash.methods.approve(routerAddress, 2^256 - 1).send({ from: accounts[0] });
            }
        }
    }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Add Liquidity</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">
                {`Provide liquidity for ${liquidityContext.token0.name || "--"}/${liquidityContext.token1.name || "--"} in the community liquidity pool!`}
            </Typography>
            <FormTokenInput />
            <UserInputButton onClick={addLiquidity} message={buttonMessage} />
        </div>
    );
}

export default LiquidityCard;