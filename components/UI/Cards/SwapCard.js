import Typography from "@material-ui/core/Typography";
import FormTokenInput from "../../Input/FormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./SwapCard.module.css";

function SwapCard(props) {

    function swap() {}

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Swap</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{`Sell ${props.token0 || "--"} for ${props.token1 || "--"}`}</Typography>
            <FormTokenInput />
            <UserInputButton onClick={swap} message="buy" />
        </div>
    );
}

export default SwapCard;