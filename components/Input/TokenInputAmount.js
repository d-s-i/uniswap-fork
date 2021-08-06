import React from "react";
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

    const classes = useStyles();

    function tokenAmountChangeHandler(event) {
        if(props.id === "token0") {
            liquidityContext.onToken0Change({amount: event.target.value});
        }
        if(props.id === "token1") {
            liquidityContext.onToken1Change({amount: event.target.value});
        }
    }

    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SelectToken mode={props.mode} id={props.id} defaultToken={props.defaultToken} />
                <input className={styles.input} onChange={tokenAmountChangeHandler} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <Typography variant="subtitle1" className={classes.liquidityBalance} >{`Balances: ${props.balances || "--"}`}</Typography>
        </div>
    );     
}

export default TokenInputAmount;