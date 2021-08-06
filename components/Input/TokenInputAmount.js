import React, { useState } from "react";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";

import SelectToken from "./SelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./TokenInputAmount.module.css";

const useStyles = makeStyles((theme) => ({
    liquidityBalance: {
      marginLeft: theme.spacing(1),
    },
  }));

function TokenInputAmount(props) {

    const liquidityContext = useAddLiquidityContext();

    const [token0Amount, setToken0Amount] = useState("");
    const [token1Amount, setToken1Amount] = useState("");

    const classes = useStyles();

    function displayValue() {
        if(props.id === "token0") return token0Amount;
        return token1Amount
    }

    function token0AmountChangeHandler(event) {
        if(props.id === "token0") {
            setToken0Amount(event.target.value);
            liquidityContext.onToken0Change({amount: event.target.value});
        }
        if(props.id === "token1") {
            setToken1Amount(event.target.value);
            liquidityContext.onToken1Change({amount: event.target.value});
        }
    }

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SelectToken id={props.id} defaultToken={props.defaultToken} />
                <input className={styles.input} onChange={token0AmountChangeHandler} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <Typography variant="subtitle1" className={classes.liquidityBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
        </div>
    );     
}

export default TokenInputAmount;