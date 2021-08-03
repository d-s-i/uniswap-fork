import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';

import styles from "./AppCardMain.module.css";

function AppCardMain(props) {
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    
    return(
        <React.Fragment>
            {xs && !sm && <div className={props.main && styles["xs-container"] || styles["xs-secondary-container"]}  >{props.children}</div>}
            {sm && !md && <div className={props.main && styles["sm-container"] || styles["sm-secondary-container"]}  >{props.children}</div>}
            {md && !lg && <div className={props.main && styles.container || styles["secondary-container"]}  >{props.children}</div>}
            {lg && <div className={props.main && styles["lg-container"] || styles["lg-secondary-container"]}  >{props.children}</div>}
        </React.Fragment>
    );
}

export default AppCardMain;