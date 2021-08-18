import React, { useEffect } from 'react';
import { useSwapContext } from "../../../store/swap-context";
import { useScreenSizeContext } from '../../../store/screenSize-context';

import babyDogeLogo from "../../../public/babyDogeLogo.png";
import BNBLogo from "../../../public/BNBLogo.png";
import babyToyLogo from "../../../public/babyToyLogo.png";
import babyLeashLogo from "../../../public/babyLeashLogo.png";
import { babyDogeData } from '../../../ethereum/tokens/babyDoge';
import { babyToyData } from '../../../ethereum/tokens/babyToy';
import { babyLeashData } from '../../../ethereum/tokens/babyLeash';
import { bnbData } from '../../../ethereum/tokens/WETH';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TokenListItems from "../../Items/TokenListItems";

import styles from "./SwapSelectToken.module.css";

function SwapSelectToken(props) {

  // BabyDoge Test Rinkeby address : 0x76c51246641F711aAAe87C8Ef2C95da186798FB2
  // BabyToy Test Rinkeby address : 0xe150341e165379cbc8b5f5e0d46Eff220E318F45
  // BabyLeash Test Rinkeby address : 0x6E78d42cCe7E83FEBfE9ed3Bb5f3074A6eEE7e7c
  // WETH address for test purposes : 0xc778417E063141139Fce010982780140Aa0cD5Ab

  const screenSizeContext = useScreenSizeContext();

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: ((screenSizeContext.size === "xs" || screenSizeContext.size === "sm") && 145) || 130,
      minHeight: 35,
      borderRadius: "2em",
      // border: "1px red solid",
      "&:hover": {
        backgroundColor: "#404040",
      }
    },
    input: {
      color: "white",
      fontSize: "1.2em",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      padding: "0 0 0 7%",
      minHeight: 35,
      "&.Mui-focused": {
        color: "white",
        margin: 0,
      }
    },
    select: {
      color: "white",
      fontSize: "1.3em",
      borderRadius: "2em",
      position: "absolute",
      width: "100%",
      // display: "flex",
      // alignItems: "center",
      height: "100%",
      border: "1px white solid",
      backgroundColor: "none",
      "& .MuiSelect-icon": {
        color: "white",
        width: 18,
        // position: "absolute",
        marginTop: "3px",
        height: 18,

      },
      "& .MuiSelect-selectMenu": {
        padding: "0 0 0 7%",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        // position: "relative",
      },
    }
  }));

  const swapContext = useSwapContext();
  const classes = useStyles();
  const [token0, setToken0] = React.useState(""); // /!\ change all the value for that it really match BNB, and not only the value on the Select component !!!  (change all the state)
  const [token1, setToken1] = React.useState(""); // /!\ change all the value for that it really match BNB, and not only the value on the Select component !!!  (change all the state)

  function setData(tokenData) {
    if(props.id === "token0") {
      setToken0(tokenData.name);
      swapContext.onToken0Change(tokenData);
    }
    if(props.id === "token1") {
      setToken1(tokenData.name);
      swapContext.onToken1Change(tokenData);
    }
  }
  
  function tokenChangeHandler(event) { 
    if(event.target.value === "BABYDOGE"){
      setData(babyDogeData);
    }
    if(event.target.value === "BABYTOY"){
      setData(babyToyData);
    }
    if(event.target.value === "BABYLEASH"){
      setData(babyLeashData);
    }
    if(event.target.value === "BNB"){
      setData(bnbData);
    }
  };
  
  useEffect(() => {
    if(swapContext.token0.name !== token0.name) {
      setToken0(swapContext.token0.name);
    }
    if(swapContext.token1.name !== token1.name) {
      setToken1(swapContext.token1.name);
    }
  }, [swapContext.token0, swapContext.token1]);

  return(
    <FormControl variant="filled" className={classes.formControl} hiddenLabel={props.id === "token0" ? token0 ? true : false : token1 ? true : false} noValidate autoComplete="off">
      {(props.id === "token0" ? !token0 : !token1) && <label className={classes.input} id="demo-simple-select-outlined-label">Select a Token</label>}
      {/* {(props.id === "token0" ? !token0 : !token1) && <InputLabel className={classes.input} id="demo-simple-select-outlined-label">Select a Token</InputLabel>} */}
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={props.id === "token0" ? token0 : token1}
        onChange={tokenChangeHandler}
        label="token"
        className={classes.select}
        disableUnderline
      >
        <MenuItem value=""><em>Select a token</em></MenuItem>
        <MenuItem value={"BABYDOGE"} className={classes.selectMenu} >
          <TokenListItems src={babyDogeLogo} token="BabyDoge" alt="babyDogeLogo" />
        </MenuItem>
        <MenuItem value={"BABYTOY"} className={classes.selectMenu} >
          <TokenListItems src={babyToyLogo} token="BabyToy" alt="babyToyLogo" />
        </MenuItem>
        <MenuItem value={"BABYLEASH"} className={classes.selectMenu} >
          <TokenListItems src={babyLeashLogo} token="BabyLeash" alt="BabyLeash" />
        </MenuItem>
        <MenuItem value={"BNB"} className={classes.selectMenu} >
          <TokenListItems src={BNBLogo} token="BNB" alt="BNBLogo" />
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default SwapSelectToken;