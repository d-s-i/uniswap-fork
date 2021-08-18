import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAddLiquidityContext } from "../../store/addLiquidity-context";
import { useSwapContext } from "../../store/swap-context";
import { useButtonContext } from "../../store/buttonMessage-context";

import Typography from "@material-ui/core/Typography";
import Switch from '@material-ui/core/Switch';
import Grid from "@material-ui/core/Grid";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddLiquidityUI from "./AddLiquidityUI";
import RemoveLiquidityUI from "./RemoveLiquidityUI";

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
      tab: {
          textDecoration: "underline",
          color: "#0ab5db",
          fontWeight: "bold"
      }
  });

function LiquidityCard(props) {

    const [toogleState, setToogleState] = useState(false);

    const classes = useStyles();

    const router = useRouter();

    function handleChange() {
        setToogleState((prevState) => setToogleState(!prevState));
    };
    
    const liquidityContext = useAddLiquidityContext();
    const swapContext = useSwapContext();
    const buttonContext = useButtonContext();
    
    useEffect(() => {
        swapContext.onToken0Change({name: "", address: "", amount: "", focus: false, approved: false, balance: 0});
        swapContext.onToken1Change({name: "", address: "", amount: "", focus: false, approved: false, balance: 0});
    }, [liquidityContext.token0, liquidityContext.token1, toogleState]);

    function swapRedirectHandler() {
        router.push("/swap");
    }

    // console.log(buttonContext.message);

    return(
        <React.Fragment>
            <Typography component="div">
                <Grid component="label" style={{marginBottom :"3%"}} container justifyContent="center" alignItems="center" spacing={1}  >
                    <Grid item className={toogleState ? "" : classes.tab} style={{fontSize: "0.8em"}} >Add liquidity</Grid>
                        <FormControlLabel
                            style={{ margin: "0" }} control={<PurpleSwitch size="medium" checked={toogleState} onChange={handleChange} name="checkedA" />}
                        />
                    <Grid item className={toogleState ? classes.tab : ""} style={{fontSize: "0.8em"}} >Remove liquidity</Grid>
                </Grid>
            </Typography>
            {!toogleState && <AddLiquidityUI onRedirect={swapRedirectHandler} isDisabled={buttonContext.isDisabled} buttonMessage={buttonContext.message} />}
            {toogleState && <RemoveLiquidityUI onRedirect={swapRedirectHandler} />}
        </React.Fragment>
    );
}

export default LiquidityCard;