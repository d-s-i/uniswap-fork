import styles from "./InsideSubCard.module.css";

function InsideSubCard(props) {
    return(
        <div className={styles["inside-sub-card"]} >{props.children}</div>
    );
}

export default InsideSubCard;