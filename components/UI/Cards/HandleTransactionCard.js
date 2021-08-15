import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import styles from "./HandleTransactionCard.module.css";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

function HandleTransactionCard(props) {

    const classes = useStyles();

    return(
        <div className={styles["tx-summary-container"]}>
            {props.displayLoading && <div className={classes.root}>
                <LinearProgress />
            </div>}
            <Typography variant="subtitle1">{props.children}</Typography>
        </div>
    );
}

export default HandleTransactionCard;