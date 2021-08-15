import React from 'react';
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";

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

function LiquiditySelectToken(props) {

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
      {!token0 && <InputLabel className={classes.input} id="demo-simple-select-outlined-label">Select a Token</InputLabel>}
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