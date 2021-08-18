import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import styles from "./AppCardSub.module.css";

function AppCard(props) {

    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    
    return(
        <React.Fragment>
            {xs && !sm && <div className={styles["xs-secondary-container"]}  >{props.children}</div>}
            {sm && !md && <div className={styles["sm-secondary-container"]}  >{props.children}</div>}
            {md && !lg && <div className={styles["secondary-container"]}  >{props.children}</div>}
            {lg && <div className={styles["lg-secondary-container"]}  >{props.children}</div>}
        </React.Fragment>
    );
}

export default AppCard;