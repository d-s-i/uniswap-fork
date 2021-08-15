import { Typography } from "@material-ui/core";
import styles from "./TransactionLink.module.css";

function TransactionLink(props) {

    return(
        <Typography variant="subtitle1">
            {props.firstPart}
            <a 
                className={styles.link} 
                href={props.url} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                {props.url.slice(0, 25)}...{props.url.slice(props.url.length - 14, props.url.length )}
            </a>
            {props.lastPart}
        </Typography>
    );
}

export default TransactionLink;