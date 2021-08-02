import styles from "./AppCard.module.css";

function AppCard(props) {
    return(
        <div className={props.main && styles.container || styles["secondary-container"]} >{props.children}</div>
    );
}

export default AppCard;