import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from "@material-ui/core";
import Image from "next/image";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Battery90Icon from '@material-ui/icons/Battery90';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRightSharp';
import babyDogeLogo from "../../public/babyDogeLogo.png";
import GroupAddSharpIcon from '@material-ui/icons/GroupAddSharp';
import React from 'react';

const useStyles = makeStyles({
    pageTitle: {
      padding: "3% 0 3% 0",
      color: "#0ab5db",
      fontWeight: "bold",
    },
    bigPresentation: {
      marginBottom: "3%",
      display: "flex"
    },
    smallPresentation: {
        marginBottom: "3%",
    },
    description: {
      width: "50%"
    },
    bigImage: {
        display: "flex",
        justifyContent: "center",
      width: "50%",
    },
    customImage: {
        objectFit: "contain",
        width: "100%",
        position: "relative",
        height: "unset",
    }
  }, { name: "MuiExample_Component" });

function PlateformDescription() {

    const styles = useStyles();

    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));

    return(
            <div className={((md ||lg) && styles.bigPresentation) || ((sm || xs || !md) && styles.smallPresentation) || ""} >
                {(md || lg) && (<div className={styles.bigImage} >
                <Image src={babyDogeLogo} className={styles.customImage} alt="logo" />
                </div>)}
                <div className={((md ||lg) && styles.description) || ""} >
                    <Typography variant="h3" component="h1" className={styles.pageTitle} >After reading all of the BabyDoge problems, we hear you hodler.</Typography>
                    <Typography variant="subtitle1" >We created a safe, specific place in order to exchange your BabyDoge at the best rate ever.</Typography>
                    <Typography variant="subtitle1" >This market place have been well thought just to provide an economic market place in order to exchange BabyDoge! You can :</Typography>
                    <List>
                        <ListItem>
                        <ListItemIcon>{<ArrowRightSharpIcon />}</ListItemIcon>
                        <ListItemText primary="Buy BabyDoge at the best rate because fees have been reduced for BabyDoge tokens here" />
                        </ListItem>
                        <ListItem>
                        <ListItemIcon>{<ArrowRightSharpIcon />}</ListItemIcon>
                        <ListItemText primary="Make a passive income off of your BabyDoge and own some BabyLeash for free by providing liquidity on BabyDogeSwap" />
                        </ListItem>
                        <ListItem>
                        <ListItemIcon>{<ArrowRightSharpIcon />}</ListItemIcon>
                        <ListItemText primary="In order for BabyLeash to have real value, we created BabyToy, a token that is given when you provide liquidity on the BabyLeash-BNB pair! Get the full panoply and earn twice more by providing liquidity !" />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" >{"We can't let ShibaSwap being the best community marketplace! Let's show them that it's important to save dog and to trade BabyDoge ! The power of community created the best market place ever."}</Typography>
                </div>
            </div>
    );
}

export default PlateformDescription;