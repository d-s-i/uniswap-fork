import Image from "next/image";

import styles from "./TokenListItems.module.css";

function TokenListItems(props) {
    return(
        <span className={styles.item} >
            <Image src={props.src} alt={props.alt} width={18} height={18} />
            <span className={styles.token} >{props.token}</span>
        </span>
    );
}

export default TokenListItems;