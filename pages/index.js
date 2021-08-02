import React, { useEffect } from "react";

import web3 from "../ethereum/web3";

import DescriptionCard from "../components/DescriptionCard/DescriptionCard";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Battery90Icon from '@material-ui/icons/Battery90';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import LensIcon from '@material-ui/icons/Lens';
import AppCard from "../components/UI/Cards/AppCard";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  pageTitle: {
    padding: "3% 0 3% 0",
    color: "#0ab5db",
    fontWeight: "bold",
  }
}, { name: "MuiExample_Component" });

export default function Home() {

  // const useEffect = React.useEffect();

  const styles = useStyles();

  const cardDescription = [
    {
      title: "You BabyDoge likes to play everywhere ?" ,
      description: "Buy a BabyLeash now! It's the powering token of BabyDogeSwap, which is the best marketplace to trade BabyDoge (with less fees) ... and, not gonna lie, BabyDoge can be wild sometimes, you desperately needs a BabyLeash if you want to be a good master ..!" ,
      action: "Swap some BabyLeash here" ,
      icon: <Battery90Icon />,
      destination: "/swap",
      middle: false
    },
    {
      title: "Get BabyLeash for Free!" ,
      description: "Withdraw your liquidity from Uniswap in a few seconds, like nothing happened, and provide it to BabyDogeSwap ... We give some BabyLeash (urgently needed for your BabyDoge)" ,
      action: "Prodive liquidity & earn BabyLeash now!" ,
      icon: <AddShoppingCartIcon />,
      middle: true,
      destination: "/liquidity",
    },
    {
      title: "The Best place to Swap BabyDoge!" ,
      description: "This place have been made by BabyDoge holders, for BabyDoge traders ... We need to trade with less fees in order to make more profits! Buy BabyDoge here with less fees than on Pancake swap !" ,
      action: "Buy some BabyDoge",
      icon: <SwapHorizontalCircleIcon />,
      destination: "/swap",
      middle: false
    }
  ];

  useEffect(() => {
    async function login() {
      await web3.eth.getAccounts();
    }
    login();
  }, []);

  return (
      <AppCard main >
          <Typography variant="h3" component="h1" className={styles.pageTitle} >After reading all of the BabyDoge problems, we hear you hodler.</Typography>
          <Typography variant="subtitle1" >We created a safe, specific place in order to exchange your BabyDoge at the best rate ever.</Typography>
          <Typography variant="subtitle1" >This market place have been well thought just to provide an economic market place in order to exchange BabyDoge! You can :</Typography>
          <List>
            <ListItem>
              <ListItemIcon>{<LensIcon />}</ListItemIcon>
              <ListItemText primary="Buy BabyDoge at the best rate because fees have been reduced for BabyDoge tokens here" />
            </ListItem>
            <ListItem>
              <ListItemIcon>{<LensIcon />}</ListItemIcon>
              <ListItemText primary="Make a passive income off of your BabyDoge and own some BabyLeash for free by providing liquidity on BabyDogeSwap" />
            </ListItem>
            <ListItem>
              <ListItemIcon>{<LensIcon />}</ListItemIcon>
              <ListItemText primary="In order for BabyLeash to have real value, we created BabyToy, a token that is given when you provide liquidity on the BabyLeash-BNB pair! Get the full panoply and earn twice more by providing liquidity !" />
            </ListItem>
          </List>
          <Typography variant="subtitle1" >{"We can't let ShibaSwap being the best community marketplace! Let's show them that it's important to save dog and to trade BabyDoge ! The power of community created the best market place ever."}</Typography>
          <Box display="flex" >
            {cardDescription.map(content => <DescriptionCard 
            key={content.title}
            title={content.title} 
            description={content.description} 
            action={content.action} 
            middle={content.middle} 
            icon={content.icon} 
            destination={content.destination} />)}
          </Box>
      </AppCard>
  );
}
