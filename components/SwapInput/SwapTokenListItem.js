import Image from "next/image";

import styles from "./SwapTokenListItem.module.css";

function SwapsTokenList(props) {
    return(
        <span className={styles.item} >
            <Image src={props.src} alt={props.alt} width={20} height={20} />
            <span className={styles.token} >{props.token}</span>
        </span>
    );
}

export default SwapsTokenList;