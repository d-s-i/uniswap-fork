import React, { useEffect } from 'react';
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";

import babyDogeLogo from "../../public/babyDogeLogo.png";
import BNBLogo from "../../public/BNBLogo.png";
import babyToyLogo from "../../public/babyToyLogo.png";
import babyLeashLogo from "../../public/babyLeashLogo.png";

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TokenListItem from "./TokenListItem";

import styles from "./SelectToken.module.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    color: "white",
    "&:hover": {
      backgroundColor: "#404040"
    }
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    color: "white"
  },
  input: {
    color: "white"
  },
  select: {
    color: "white",
    border: "1px white solid",
    "& > svg": {
      color: "white",
      
    },
    "& .data-shrink": {
      color: "white"
    },
    shrinked: {
      color: "white"
    },
  },
  bnb: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
    minWidth: 200,
    height: "50px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    border: "1px grey solid",
    borderRadius: "1em",
    color: "white",
    "&:hover": {
      backgroundColor: "#262626",
    }
  }
}));

function SelectToken(props) {

  // BabyDoge Test Rinkeby address : 0x010b3D7055e53847480FDBdA62771c6D74C76453 + BabyDoge/WETH pool address : 0x62871F8333Ed01C3F7e4AEe6aeA642c441e69671
  // BabyToy Test Rinkeby address : 0xe150341e165379cbc8b5f5e0d46Eff220E318F45
  // BabyLeash Test Rinkeby address : 0x6E78d42cCe7E83FEBfE9ed3Bb5f3074A6eEE7e7c
  // WETH address for test purposes : 0xc778417E063141139Fce010982780140Aa0cD5Ab

  const addLiquidityContext = useAddLiquidityContext();
  const swapContext = useSwapContext();
  const classes = useStyles();
  const [token0, setToken0] = React.useState(""); // /!\ change all the value for that it really match BNB, and not only the value on the Select component !!!  (change all the state)
  const [token1, setToken1] = React.useState(props.defaultToken); // /!\ change all the value for that it really match BNB, and not only the value on the Select component !!!  (change all the state)

  const babyDogeData = {name: "BABYDOGE", address: "0x010b3D7055e53847480FDBdA62771c6D74C76453"};
  const babyToyData = {name: "BABYTOY", address: "0xe150341e165379cbc8b5f5e0d46Eff220E318F45"};
  const babyLeashData = {name: "BABYLEASH", address: "0x6E78d42cCe7E83FEBfE9ed3Bb5f3074A6eEE7e7c"};
  const bnbData = {name: "BNB", address: "0xc778417E063141139Fce010982780140Aa0cD5Ab"};

  function setData(tokenData) {
    if(props.id === "token0") {
      setToken0(tokenData.name);
      changeRightContext(tokenData);
    }
    if(props.id === "token1") {
      setToken1(tokenData.name);
      changeRightContext(tokenData);
    }
  }
  
  
  function changeRightContext(token) {
    if(props.mode === "liquidity") {
      addLiquidityContext.onToken0Change(token);
    }
    if(props.mode === "swap") {
      if(props.id === "token0") {
        swapContext.onToken0Change(token);
      }
      if(props.id === "token1") {
        swapContext.onToken1Change(token);
      }
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
  }, [swapContext.token0, swapContext.token1])
  
  if(props.mode === "liquidity" && props.defaultToken === "BNB") {
    return (
      <div className={classes.bnb} >
        <TokenListItem src={BNBLogo} token="BNB" alt="BNBLogo" />
      </div>
    );  
  }

  return(
    <FormControl variant="filled" className={classes.formControl} hiddenLabel={props.id === "token0" ? token0 ? true : false : token1 ? true : false} noValidate autoComplete="off">
      {(props.id === "token0" ? !token0 : !token1) && <InputLabel className={classes.input} id="demo-simple-select-outlined-label">Select a Token</InputLabel>}
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={props.id === "token0" ? token0 : token1}
        onChange={tokenChangeHandler}
        label="token"
        className={classes.select}
      >
        <MenuItem value=""><em>Select a token</em></MenuItem>
        <MenuItem value={"BABYDOGE"}>
          <TokenListItem src={babyDogeLogo} token="BabyDoge" alt="babyDogeLogo" />
        </MenuItem>
        <MenuItem value={"BABYTOY"}>
          <TokenListItem src={babyToyLogo} token="BabyToy" alt="babyToyLogo" />
        </MenuItem>
        <MenuItem value={"BABYLEASH"}>
          <TokenListItem src={babyLeashLogo} token="BabyLeash" alt="BabyLeash" />
        </MenuItem>
        {props.mode === "swap" && (
          <MenuItem value={"BNB"}>
            <TokenListItem src={BNBLogo} token="BNB" alt="BNBLogo" />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

export default SelectToken;