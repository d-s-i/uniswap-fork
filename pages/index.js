import React from "react";

import DescriptionCard from "../components/DescriptionCard/DescriptionCard";
import PlateformDescription from "../components/Presentation/PlateformDescription";
import Grid from "@material-ui/core/Grid";
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import AppCardMain from "../components/UI/Cards/AppCardMain";
import FiberNewSharpIcon from '@material-ui/icons/FiberNewSharp';
import Footer from "../components/UI/Footer/Footer";
import BabyToyDescription from "../components/Presentation/BabyToyDescription";
import { SettingsInputComponentRounded } from "@material-ui/icons";

export default function Home() {

  const cardDescription = [
    {
      title: "The Best place to Swap BabyDoge!" ,
      description: "This place have been made by BabyDoge holders, for BabyDoge traders ... We need to trade with less fees in order to make more profits! Buy BabyDoge here with less fees than on Pancake swap !" ,
      action: "Buy some BabyDoge with less fees!",
      icon: <SwapHorizontalCircleIcon />,
      destination: "/swap",
    },
    {
      title: "Make your BabyDoge happy!",
      description: "Give him some BabyToy to play with! BabyToy is the native token of the BabyDogeSwap plateform. It's a token just like BabyDoge, except that its tokenomics are made to empower the BabyDoge army. We studied the best projects out there, and figured out how we coulc combine there technics to empower the BabyDoge army. (hint: its all about the community, see below)",
      action: "Make BabyToy go to the moon!",
      icon: <SwapHorizontalCircleIcon />,
      destination: "/swap"
    },
    {
      title: "You BabyDoge likes to play everywhere ?" ,
      description: "BabyLeash is a key token in the BabyDogeSwap ecosystem because it allow the community to get rewarded on top of there BabyToy tokens. Without the BabyLeash token, the BabyToy token would be hard to buy. Discover how we make both of them super useful and give them value!" ,
      action: "Swap some BabyLeash early!" ,
      icon: <SwapHorizontalCircleIcon />,
      destination: "/swap",
    },
    {
      title: "We're giving some BabyToy for free to the community!",
      description: "Your task for the community is to provide liquidity to the BabyDoge-BNB pair and prove your loyalty to this amazing community. Do so, and we'll give you many BabyToys as a reward and as a thank you.",
      action: "Get your BabyToy now!",
      icon: <FiberNewSharpIcon />,
      destination: "/liquidity"
    },
    {
      title: "Get BabyLeash for Free!" ,
      description: "Withdraw your liquidity from Uniswap in a few seconds, like nothing happened, and provide it to BabyDogeSwap ... We give some BabyLeash (urgently needed for your BabyDoge)" ,
      action: "Prodive liquidity & earn BabyLeash!" ,
      icon: <FiberNewSharpIcon />,
      destination: "/liquidity",
    },
    {
      title: "The Best place to Swap BabyLeash!" ,
      description: "This place have been made by BabyDoge holders, for BabyDoge traders ... We need to trade with less fees in order to make more profits! Buy BabyDoge here with less fees than on Pancake swap !" ,
      action: "Get some BabyLeash",
      icon: <FiberNewSharpIcon />,
      destination: "/liquidity",
    }
  ];

  return (
    <AppCardMain main >
      <PlateformDescription />
      <Grid container spacing={2} justifyContent="center" >  
        {cardDescription.map(content => {
          return (
          <Grid item key={content.title} xs={12} sm={7} md={4} lg={4} >
              <DescriptionCard 
                title={content.title} 
                description={content.description} 
                action={content.action} 
                icon={content.icon} 
                destination={content.destination} />
          </Grid>)})}
      </Grid>
      <BabyToyDescription />
    <Footer />
    </AppCardMain>
  );
}
