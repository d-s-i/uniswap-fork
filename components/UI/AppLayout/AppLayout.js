import React from "react";
import Link from "next/link";

import web3 from "../../../ethereum/web3";

import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core";
import Image from "next/image";

import PriceCard from "../../PriceCard/PriceCard";
import babyDogeLogo from "../../../public/babyDogeLogo.png";
import LoginButton from "../Buttons/LoginButton";

const useStyles = makeStyles({
    brandName: {
        fontSize: "2.5em",
        paddingLeft: "1%"
    },
    menu: {
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
        "&:hover": {
            cursor: "pointer"
        }
    },
    left: {
        display: "flex",
        justifyContent: "flex-end",
        width: "50%"
    },
    toolbar: {
        justifyContent: "space-between",
    },
    appbar: {
        backgroundColor: "#0ab5db",
        padding: "0 5% 0 5%"
    },
    loginButton: {
        backgroundColor: "white",
        fontSize: "1.2em",
        fontWeight: "bold",
        borderRadius: "100rem",
        color: "#0ab5db",
        margin: "1% 1% 1% 1%",
        padding: "1% 0 1% 0",
        width: "150px",

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
        padding: "1% 0 1% 0",
        width: "250px"
    }
});

function AppLayout() {

    const styles = useStyles();

    async function loginHandler() {
        await web3.eth.getAccounts();
    }

    return(
        <AppBar position="static" className={styles.appbar} >
            <Toolbar className={styles.toolbar} >
                <Link href="/" passHref >
                    <div className={styles.menu} >
                        <Image src={babyDogeLogo} width={50} height={50} alt="logo" />
                        <Typography variant="h6" className={styles.brandName} >BabyDogeSwap</Typography>
                    </div >
                </Link>
                <div className={styles.left} >
                    <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyDoge"} $${"0.00000125"}`}</Button>
                    <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyLeash"} $${"0.0000625"}`}</Button>
                    <Button disableRipple className={styles.priceButton} variant="contained" >{`${"BabyDoge"} $${"101.12"}`}</Button>
                    <Button className={styles.loginButton} variant="contained" onClick={loginHandler} >Login</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppLayout;