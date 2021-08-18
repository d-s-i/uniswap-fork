import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LaunchIcon from '@material-ui/icons/Launch';

import { makeStyles } from '@material-ui/core/styles';
import styles from "./TitleCard.module.css";

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
      textTransform: "none",
      fontSize: "1em",
    },
    endIcon: {
        width: "14px",
        height: "14px"
    },
    swapTitle: {
        color: "#0ab5db",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        fontSize: "2.5em"
    }
  }));

function TitleCard(props) {
    const classes = useStyles();

    return(
        <div className={styles.top} >
            <Typography className={classes.swapTitle} variant="h4">{props.title}</Typography>
            <Button
                variant="contained"
                size="small"
                className={classes.button}
                endIcon={<LaunchIcon className={classes.endIcon} />}
                onClick={props.onRedirect}
            >
                {props.redirectionName}
            </Button>
        </div>
    );
}

export default TitleCard;