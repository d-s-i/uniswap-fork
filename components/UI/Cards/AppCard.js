import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styles from "./AppCard.module.css";

function AppCard(props) {

    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    
    return(
        <div>
            {xs && !sm && !md && <div className={props.main && styles["xs-container"] || styles["xs-secondary-container"]}  >{props.children}</div>}
            {sm && !md && <div className={props.main && styles["sm-container"] || styles["sm-secondary-container"]}  >{props.children}</div>}
            {md && !lg && <div className={props.main && styles.container || styles["secondary-container"]}  >{props.children}</div>}
            {lg && <div className={props.main && styles["lg-container"] || styles["lg-secondary-container"]}  >{props.children}</div>}
        </div>
    );
}

export default AppCard;