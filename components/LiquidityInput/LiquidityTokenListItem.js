import Image from "next/image";

import styles from "./LiquidityTokenListItem.module.css";

function LiquidityTokenList(props) {
    return(
        <span className={styles.item} >
            <Image src={props.src} alt={props.alt} width={20} height={20} />
            <span className={styles.token} >{props.token}</span>
        </span>
    );
}

export default LiquidityTokenList;