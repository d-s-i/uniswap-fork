import { useAddLiquidityContext } from "../../store/addLiquidity-context";

import { convertEthToWei, approveTokens, checkRouterAllowance } from "../../helpers/functionsHelper";
import router, { routerAddress } from "../../ethereum/router";
import web3 from "../../ethereum/web3";

import LiquidityFormTokenInput from "./LiquidityFormTokenInput";
import UserInputButton from "../UI/Buttons/UserInputButton";
import SubCard from "../UI/Cards/SubCard";

import { Typography } from "@material-ui/core";

import styles from "./AddLiquidityUI.module.css";

function AddLiquidityUI(props) {

    const liquidityContext = useAddLiquidityContext();

    const tokenName = liquidityContext.token0.name;
    const token0Amount = liquidityContext.token0.amount;
    const token1Amount = liquidityContext.token1.amount;

    const slippage = 50 / 100;

    async function addLiquidity() {
        const accounts = await web3.eth.getAccounts();

        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const isRouterAllowed = await checkRouterAllowance(tokenName, token0Amount);

        if(isRouterAllowed && token0Amount !== 0) {
            await router.methods
                .addLiquidityETH(
                    `${liquidityContext.token0.address}`, 
                    `${convertEthToWei(token0Amount)}`, 
                    `${convertEthToWei(token0Amount * (1 - slippage))}`, // commented because  I have a problem, token0Amount is 1 wei when calculated from the quote function, so token0Amount*(1-slippage) === 0.5 wei ...
                    `${convertEthToWei(token1Amount * (1 - slippage))}`,  // need to resolve the quote problem and getting a real value
                    accounts[0], 
                    deadline)
                .send({ 
                        from: accounts[0], 
                        value: convertEthToWei(token1Amount) 
                    }); // AJOUTER DU SLIPPAGE DYNAMIQUE
        }
        if(!isRouterAllowed && parseFloat(token0Amount) !== 0) {
            await approveTokens(tokenName);
            liquidityContext.onToken0Change({ approved : true });
        }
    }
    
    return(
        <SubCard >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Add Liquidity</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">
                {`Add liquidity for ${liquidityContext.token0.name || "--"}/${liquidityContext.token1.name || "--"} in the community liquidity pool!`}
            </Typography>
            <LiquidityFormTokenInput />
            <UserInputButton onClick={addLiquidity} disabled={props.isDisabled} message={props.buttonMessage} />
        </SubCard>
    );
}

export default AddLiquidityUI;