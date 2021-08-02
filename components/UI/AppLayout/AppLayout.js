import React from "react";
import Link from "next/link";

import { AppBar, Toolbar, Typography, makeStyles, Button } from "@material-ui/core";
import Image from "next/image";

import PriceCard from "../../PriceCard/PriceCard";
import babyDogeLogo from "../../../public/babyDogeLogo.png";

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
    },
    toolbar: {
        justifyContent: "space-between",
    },
    appbar: {
        backgroundColor: "#0ab5db",
        padding: "0 5% 0 5%"
    }
});

function AppLayout() {

    const styles = useStyles();

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
                    <PriceCard token="BabyToy" price="101.12" />
                    <PriceCard token="BabyLeash" price="0.0005" />
                    <PriceCard token="BabyDoge" price="0.0000012" />
                    <Button variant="outlined" color="primary">Login</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppLayout;