import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Typography from "@material-ui/core/Typography";

import styles from "./UserInputButton.module.css";

const useStyles = makeStyles({
    liquidityButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        fontWeight: "bold"
    },
    liquidityIcon: {
        marginRight: "10px"
    },
    tab: {
        textDecoration: "underline",
        color: "#0ab5db",
        fontWeight: "bold"
    }
});

function UserInputButton(props) {

    const classes = useStyles();

    let buttonIcon;

    if(props.type === "addLiquidity") buttonIcon = <AddCircleOutlinedIcon className={classes.liquidityIcon} />;
    if(props.type === "removeLiquidity") buttonIcon = <HighlightOffRoundedIcon className={classes.liquidityIcon} />;
    
    return(
        <button onClick={props.onClick} className={(props.disabled && styles["button-disabled"]) || styles.button} disabled={props.disabled} >
            <Typography variant="subtitle1" className={classes.liquidityButton} >{buttonIcon}</Typography>
            {props.message}
        </button>
    );
}

export default UserInputButton;