import Image from "next/image";

import styles from "./TokenListItem.module.css";

function TokenList(props) {
    return(
        <span className={styles.item} >
            <Image src={props.src} alt={props.alt} width={20} height={20} />
            <span className={styles.token} >{props.token}</span>
        </span>
    );
}

export default TokenList;