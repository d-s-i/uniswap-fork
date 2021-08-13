import styles from "./SubCard.module.css";

function SubCard(props) {
    return(
        <div className={styles["sub-container"]}>{props.children}</div>
    );
}

export default SubCard;