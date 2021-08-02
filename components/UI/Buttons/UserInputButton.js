import React from "react";

import styles from "./UserInputButton.module.css";

function UserInputButton(props) {
    
    return(
        <button onClick={props.onClick} className={styles.button} >{props.message}</button>
    );
}

export default UserInputButton;