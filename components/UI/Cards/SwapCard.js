import { useSwapContext } from "../../../store/swap-context";

import router from "../../../ethereum/router";

import Typography from "@material-ui/core/Typography";
import FormTokenInput from "../../Input/FormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./SwapCard.module.css";

function SwapCard(props) {

    const swapContext = useSwapContext();

    async function swap() {
        // if(token0.focus) {
        //     token1Amount = await router.methods.getAmountsOut().call();
        // }
        // if(token1.focus) {
        //     token0Amount = await router.methods.getAmountsIn().call();
        // }
        
        console.log(swapContext.token0.amount);
        console.log(swapContext.token1.amount);
    }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Swap</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{`Exchange your ${swapContext.token0.name || "--"} for ${swapContext.token1.name || "--"}`}</Typography>
            <FormTokenInput mode={"swap"} />
            <UserInputButton onClick={swap} message="Swap" />
        </div>
    );
}

export default SwapCard;