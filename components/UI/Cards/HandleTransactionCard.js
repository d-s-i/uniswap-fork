import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Grid from "@material-ui/core/Grid";

import styles from "./HandleTransactionCard.module.css";
import React from 'react';

const useStyles = makeStyles(() => ({
    progress: {
      margin: "0 20% 0 20%",
      top: "1em",
    },
    
  }));

  const BorderLinearProgress = withStyles(() => ({
    bar: {
        backgroundColor: "#0ab5db",
   }
}))(LinearProgress);

function HandleTransactionCard(props) {

    const classes = useStyles();

    return(
        <div className={styles.container} >
                {props.displayLoading && (
                    <Grid style={{display: "flex"}} justifyContent="space-between">
                        <div className={styles.select}>
                            <BorderLinearProgress className={classes.progress} />
                        </div>
                        <CloseIcon style={{cursor: "pointer"}} onClick={props.onCloseModal} />
                    </Grid>
                )}
            <div className={styles.contained} >
                    <Typography variant="subtitle1">{props.children}</Typography>
                    {!props.displayLoading && <CloseIcon style={{cursor: "pointer"}} onClick={props.onCloseModal} />}
            </div>
            <div className={styles["display-button"]} >
                <button className={styles.button} onClick={props.onCloseModal} >Close</button>
            </div>
        </div>
    );
}

export default HandleTransactionCard;