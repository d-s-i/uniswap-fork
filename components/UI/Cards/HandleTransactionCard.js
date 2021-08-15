import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import styles from "./HandleTransactionCard.module.css";

const useStyles = makeStyles((theme) => ({
    progress: {
      position: "relative",
      marginLeft: "20%",
      marginRight: "20%",
    },
    
  }));

  const BorderLinearProgress = withStyles(theme => ({
    bar: {
        backgroundColor: "#0ab5db",
   }
}))(LinearProgress);

function HandleTransactionCard(props) {

    const classes = useStyles();

    return(
        <div className={styles["tx-summary-container"]}>
            {props.displayLoading && <div className={styles.select}>
                <BorderLinearProgress className={classes.progress} />
            </div>}
            <Typography variant="subtitle1">{props.children}</Typography>
        </div>
    );
}

export default HandleTransactionCard;