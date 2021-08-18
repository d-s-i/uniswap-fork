import React from 'react';
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useScreenSizeContext } from '../../../store/screenSize-context';

import babyDogeLogo from "../../../public/babyDogeLogo.png";
import BNBLogo from "../../../public/BNBLogo.png";
import babyToyLogo from "../../../public/babyToyLogo.png";
import babyLeashLogo from "../../../public/babyLeashLogo.png";
import { babyDogeData } from '../../../ethereum/tokens/babyDoge';
import { babyToyData } from '../../../ethereum/tokens/babyToy';
import { babyLeashData } from '../../../ethereum/tokens/babyLeash';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TokenListItems from "../../Items/TokenListItems";

import styles from "./LiquiditySelectToken.module.css";

function LiquiditySelectToken(props) {

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
    },
    bnb: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(3),
      minWidth: ((screenSizeContext.size === "xs" || screenSizeContext.size === "sm") && 145) || 130,
      minHeight: 35,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      border: "1px grey solid",
      borderRadius: "2em",
      color: "white",
      "&:hover": {
        backgroundColor: "#262626",
      }
    }
  }));
  

  const addLiquidityContext = useAddLiquidityContext();
  const classes = useStyles();
  const [token0, setToken0] = React.useState(""); // /!\ change all the value for that it really match BNB, and not only the value on the Select component !!!  (change all the state)

  function setData(tokenData) {
    setToken0(tokenData.name);
    addLiquidityContext.onToken0Change(tokenData);
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
  
  if(props.defaultToken === "BNB") {
    return (
      <div className={classes.bnb} >
        <TokenListItems src={BNBLogo} token="BNB" alt="BNBLogo" />
      </div>
    );  
  }

  return(
    <FormControl variant="filled" className={classes.formControl} hiddenLabel={props.id === "token0" ? token0 ? true : false : token1 ? true : false} noValidate autoComplete="off">
      {!token0 && <label className={classes.input} id="demo-simple-select-outlined-label">Select a Token</label>}
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
        <MenuItem value={"BABYDOGE"}>
          <TokenListItems src={babyDogeLogo} token="BabyDoge" alt="babyDogeLogo" />
        </MenuItem>
        <MenuItem value={"BABYTOY"}>
          <TokenListItems src={babyToyLogo} token="BabyToy" alt="babyToyLogo" />
        </MenuItem>
        <MenuItem value={"BABYLEASH"}>
          <TokenListItems src={babyLeashLogo} token="BabyLeash" alt="BabyLeash" />
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default LiquiditySelectToken;