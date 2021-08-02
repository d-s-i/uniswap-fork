import React from 'react';
import Image from "next/image";

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
    }
  }
}));

function SelectToken() {

  const classes = useStyles();
  const [token, setToken] = React.useState('');

  const handleChange = (event) => {
    console.log(event.target.value),
    setToken(event.target.value);
  };
    
    return(
      <FormControl variant="filled" className={classes.formControl} hiddenLabel={token ? true : false} noValidate autoComplete="off">
        {!token && <InputLabel className={classes.input} id="demo-simple-select-outlined-label">Select a Token</InputLabel>}
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={token.name}
          onChange={handleChange}
          label="token"
          className={classes.select}
        >
          <MenuItem value=""><em>Nones</em></MenuItem>
          <MenuItem value={10}>
            <TokenListItem src={babyDogeLogo} token="BabyDoge" alt="babyDogeLogo" />
          </MenuItem>
          <MenuItem value={20}>
            <TokenListItem src={babyToyLogo} token="BabyToy" alt="babyToyLogo" />
          </MenuItem>
          <MenuItem value={30}>
            <TokenListItem src={babyLeashLogo} token="BabyLeash" alt="BabyLeash" />
          </MenuItem>
          <MenuItem value={40}>
            <TokenListItem src={BNBLogo} token="BNB" alt="BNBLogo" />
          </MenuItem>
        </Select>
      </FormControl>
    );
}

export default SelectToken;