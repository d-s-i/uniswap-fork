import React from "react";

import styles from "./PriceCard.module.css";

function PriceCard(props) {
    return(
        <button className={styles.card} >{`${props.token} $${props.price}`}</button>
    );
}

export default PriceCard;