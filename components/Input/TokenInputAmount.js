import React from "react";

import SelectToken from "./SelectToken";
import { Typography, makeStyles } from "@material-ui/core";

import styles from "./TokenInputAmount.module.css";

const useStyles = makeStyles((theme) => ({
    liquidityBalance: {
      marginLeft: theme.spacing(1),
    },
  }));

function TokenInputAmount(props) {

    const classes = useStyles();
    
    return(
        <div className={styles.container} >
            <div className={styles.containerInput} >
                <SelectToken />
                <input className={styles.input} type="text" id={props.id} name={props.name} placeholder="0.0" />
            </div>
            <Typography variant="subtitle1" className={classes.liquidityBalance} >Balance --</Typography>
        </div>
    );     
}

export default TokenInputAmount;