import React, { useEffect } from "react";
import Link from "next/link";
import { useAuthContext } from "../../../store/auth-context";

import web3 from "../../../ethereum/web3";

import ErrorModal from "../Modal/ErrorModal";
import styles from "./AppLayout.module.css";

import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Image from "next/image";

import babyDogeLogo from "../../../public/babyDogeLogo.png";


function AppLayout() {
    
    const context = useAuthContext();

    const theme = useTheme();

    const useStyles = makeStyles(theme => ({
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
            borderRadius: "100rem",
            margin: "1% 1% 1% 1%",
            padding: "0.5% 4% 0.5% 4%",
            [theme.breakpoints.up("sm")]: {
                width: "100px",
              },
              [theme.breakpoints.up("md")]: {
                width: "200px",
              },
              [theme.breakpoints.up("lg")]: {
                width: "400px",
              }
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
        },
        fontButton: {
            fontSize: "1em",
            fontWeight: "bold",
            color: "#0ab5db",
            [theme.breakpoints.up("sm")]: {
                fontSize: "0.8rem",
              },
              [theme.breakpoints.up("md")]: {
                fontSize: "0.8rem",
              },
              [theme.breakpoints.up("lg")]: {
                fontSize: "1rem",
              }
        }
    }));
    
    useEffect(() => {
        context.onLogin();
    }, []);

    const classes = useStyles();

    const md = useMediaQuery(theme.breakpoints.up("md"));
    const lg = useMediaQuery(theme.breakpoints.up("lg"));

    async function loginHandler() {
        await context.onLogin();
    }

    async function checkNetworkHandler() {

        const networkId = await web3.eth.net.getId();
        context.onNetworkChange(networkId);
    }
    
    const buttonContent = context.accounts[0] ? `${context.accounts[0].slice(0, 5)}...${context.accounts[0].slice(context.accounts[0].length - 4, context.accounts[0].length)}` : "Login";

    return(
        <AppBar position="static" className={classes.appbar} >
            {!context.isNetworkRight && <ErrorModal message="Please connect to the right Rinkeby network" displayButton={false} />}
            <Toolbar >
                <Link href="/" passHref >
                    <div className={classes.menu} >
                        <Image onLoad={checkNetworkHandler} src={babyDogeLogo} width={50} height={50} alt="logo" />
                        <Typography variant="h4" className={classes.brandName} style={{ fontWeight: "bold" }} >BabyDogeSwap</Typography>
                    </div >
                </Link>
                <div className={classes.left} >
                    {lg && <Button disableRipple className={classes.priceButton} variant="contained" >{`${"BabyDoge"} $${"0.00000125"}`}</Button>}
                    {lg && <Button disableRipple className={classes.priceButton} variant="contained" >{`${"BabyLeash"} $${"0.0000625"}`}</Button>}
                    {lg && <Button disableRipple className={classes.priceButton} variant="contained" >{`${"BabyDoge"} $${"101.12"}`}</Button>}
                    {md && !lg && <Button disableRipple className={classes.priceButton} variant="contained" style={{fontSize: "0.7em"}}>{`${"BabyDoge"} $${"0.00000125"}`}</Button>}
                    {md && !lg && <Button disableRipple className={classes.priceButton} variant="contained" style={{fontSize: "0.7em"}}>{`${"BabyLeash"} $${"0.0000625"}`}</Button>}
                    {md && !lg && <Button disableRipple className={classes.priceButton} variant="contained" style={{fontSize: "0.7em"}}>{`${"BabyDoge"} $${"101.12"}`}</Button>}
                    <Button className={classes.loginButton} variant="contained" onClick={loginHandler} style={{textTransform: "lowercase"}} >
                        <Typography className={classes.fontButton} >{buttonContent}</Typography>
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppLayout;