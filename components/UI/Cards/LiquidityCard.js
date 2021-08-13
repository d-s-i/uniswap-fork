import { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useAuthContext } from "../../../store/auth-context";

import web3 from "../../../ethereum/web3";
import router, { routerAddress } from "../../../ethereum/router";
import factory from "../../../ethereum/factory";
import compiledERC20 from "../../../ethereum/contracts/core/build/ERC20.json";
import babyDoge from "../../../ethereum/tokens/babyDoge";
import babyToy from "../../../ethereum/tokens/babyToy";
import babyLeash from "../../../ethereum/tokens/babyLeash";
import { wethAddress } from "../../../ethereum/tokens/WETH";
import { convertEthToWei, checkRouterAllowance, approveTokens } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import Switch from '@material-ui/core/Switch';
import Grid from "@material-ui/core/Grid";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import AddLiquidityUI from "../../LiquidityInput/AddLiquidityUI";
import RemoveLiquidityInput from "../../LiquidityInput/RemoveLiquidityInput";

import styles from "./LiquidityCard.module.css";
import React from "react";

const PurpleSwitch = withStyles({
    root: {
        width: "80px",
        height: "50px"
    },
    thumb: {
        width: 30,
        height: 30,
      },
    switchBase: {
        color: "#0ab5db",
        // padding: "30px",
        margin: "0",
        padding: "10px",
        '&$checked': {
            color: "#0ab5db",
            transform: 'translateX(30px)',
        },
        '&$checked + $track': {
            backgroundColor: "white",
        },
    },
    checked: {},
    track: {
        backgroundColor: "white",
        borderRadius: "10em"
    },
  })(Switch);

  const useStyles = makeStyles({
      liquidityButton: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          fontWeight: "bold"
      },
      liquidityIcon: {
          marginRight: "10px"
      },
      tab: {
          textDecoration: "underline",
          color: "#0ab5db",
          fontWeight: "bold"
      }
  });

function LiquidityCard(props) {

    const [buttonMessage, setButtonMessage] = useState("Add Liquidity");
    const [isDisabled, setIsDisabled] = useState(true);
    const [toogleState, setToogleState] = useState(false);

    const classes = useStyles();

    function handleChange() {
        setToogleState((prevState) => setToogleState(!prevState));
    };
    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();

    const tokenName = liquidityContext.token0.name;
    const token0Amount = liquidityContext.token0.amount;
    const token1Amount = liquidityContext.token1.amount;

    const slippage = 50 / 100;

    async function getButtonMessage() {
        const isAllowed = await checkRouterAllowance(liquidityContext.token0.name, liquidityContext.token0.amount);
        if(tokenName === "token0") return "Select a token";
        if(isAllowed) return `${toogleState ? "Remove" : "Add"} Liquidity`;
        if(!token0Amount) return `Enter a ${tokenName} amount`;
        if(!token1Amount) return "Enter a BNB amount";
        if(!isAllowed && tokenName) return `Approve ${tokenName}`;
    }
    
    useEffect(() => {
        async function changeMessageHandler() {
            const buttonIcon = <AddCircleOutlinedIcon className={classes.liquidityIcon} />;
            const message = await getButtonMessage();

            setButtonMessage(
                <Typography variant="h6" component="div" className={classes.liquidityButton} >
                    <Typography variant="h6" className={classes.liquidityButton} >{buttonIcon}</Typography>
                    {message}
                </Typography>);
        }
        changeMessageHandler();
    }, [liquidityContext.token0, liquidityContext.token1, toogleState]);

    useEffect(() => {
        setIsDisabled(parseFloat(token0Amount) === 0 || parseFloat(token1Amount) === 0 || token0Amount === "" || token1Amount === "");
    }, [token0Amount, token1Amount]);

    return(
        <React.Fragment>
            <Typography component="div">
                <Grid component="label" container justifyContent="center" alignItems="center" spacing={1}  >
                    <Grid item className={toogleState ? "" : classes.tab} >Add liquidity</Grid>
                        <FormControlLabel
                            style={{ margin: "0" }} control={<PurpleSwitch size="medium" checked={toogleState} onChange={handleChange} name="checkedA" />}
                        />
                    <Grid item className={toogleState ? classes.tab : ""} >Remove liquidity</Grid>
                </Grid>
            </Typography>
            {!toogleState && <AddLiquidityUI toogle={toogleState} isDisabled={isDisabled} buttonMessage={buttonMessage} />}
            {toogleState && <RemoveLiquidityInput />}
        </React.Fragment>
    );
}

export default LiquidityCard;