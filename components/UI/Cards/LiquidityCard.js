import web3 from "../../../ethereum/web3";
import router from "../../../ethereum/router";

import Typography from "@material-ui/core/Typography";
import FormTokenInput from "../../Input/FormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./LiquidityCard.module.css";

const ethToWei = (ethAmount) => web3.utils.toWei(`${ethAmount}`, "ether");

function LiquidityCard(props) {

    async function addLiquidity() {
        const accounts = await web3.eth.getAccounts();

        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 100000;

        await router.methods
        .addLiquidityETH("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", "1", "1", ethToWei(1), accounts[0], deadline)
        .send({ from: accounts[0], gas: "3000000", value: ethToWei(1) });
    }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Add Liquidity</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{`Provide liquidity for ${props.token0 || "--"} and ${props.token1 || "--"} in the community liquidity pool!`}</Typography>
            <FormTokenInput />
            <UserInputButton onClick={addLiquidity} message="buy" />
        </div>
    );
}

export default LiquidityCard;