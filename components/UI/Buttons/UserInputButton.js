import React from "react";

import styles from "./UserInputButton.module.css";

function UserInputButton(props) {
    
    return(
        <button onClick={props.onClick} className={(props.disabled && styles["button-disabled"]) || styles.button} disabled={props.disabled} >{props.message}</button>
    );
}

export default UserInputButton;