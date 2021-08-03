import React from "react";
import Link from "next/link";

import web3 from "../../../ethereum/web3";

import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Image from "next/image";

import babyDogeLogo from "../../../public/babyDogeLogo.png";

const useStyles = makeStyles({
    brandName: {
        paddingLeft: "2%"
    },
    menu: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexGrow: 1,
        width: "50%",
        "&:hover": {
            cursor: "pointer"
        }
    },
    left: {
        display: "flex",
        justifyContent: "flex-end",
        width: "50%"
    },
    appbar: {
        backgroundColor: "#0ab5db",
    },
    loginButton: {
        backgroundColor: "white",
        fontSize: "1.2em",
        fontWeight: "bold",
        borderRadius: "100rem",
        color: "#0ab5db",
        margin: "1% 1% 1% 1%",
        padding: "0.5% 4% 0.5% 4%",
    },
    priceButton: {
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(to bottom left, #000000 30%, #ffcc66 100%)",
        color: "#cccccc",
        borderRadius: "100rem",
        border: "solid 3px transparent",
        backgroundOrigin: "border-box",
        backgroundClip: "ontent-box, border-box",
        boxShadow: "2px 1000px 1px #121212 inset",
        margin: "1% 1% 1% 1%",
        padding: "0 0 0 0",
        width: "100%",
        whiteSpace: "nowrap"
    }
});

function AppLayout() {

    const styles = useStyles();

    const theme = useTheme();

    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));

    async function loginHandler() {
        await web3.eth.getAccounts();
    }

    return(
        <AppBar position="static" className={styles.appbar} >
            <Toolbar >
                <Link href="/" passHref >
                    <div className={styles.menu} >
                        <Image src={babyDogeLogo} width={50} height={50} alt="logo" />
                        <Typography variant="h4" className={styles.brandName} style={{ fontWeight: "bold" }} >BabyDogeSwap</Typography>
                    </div >
                </Link>
                <div className={styles.left} >
                    {lg && <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyDoge"} $${"0.00000125"}`}</Button>}
                    {lg && <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyLeash"} $${"0.0000625"}`}</Button>}
                    {lg && <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyDoge"} $${"101.12"}`}</Button>}
                    {md && !lg && <Button disableRipple className={styles.priceButton} variant="contained" style={{fontSize: '0.7em'}}>{`${"BabyDoge"} $${"0.00000125"}`}</Button>}
                    {md && !lg && <Button disableRipple className={styles.priceButton} variant="contained" style={{fontSize: '0.7em'}}>{`${"BabyLeash"} $${"0.0000625"}`}</Button>}
                    {md && !lg && <Button disableRipple className={styles.priceButton} variant="contained" style={{fontSize: '0.7em'}}>{`${"BabyDoge"} $${"101.12"}`}</Button>}
                    <Button className={styles.loginButton} variant="contained" onClick={loginHandler} >Login</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppLayout;