import Typography from "@material-ui/core/Typography";
import FormTokenInput from "../../Input/FormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./LiquidityCard.module.css";

function LiquidityCard(props) {

    function addLiquidity() {}

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