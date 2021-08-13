import React, { useReducer, useState, useEffect } from "react";
import Image from "next/image";

import SubCard from "../UI/Cards/SubCard";
import InsideSubCard from "../UI/Cards/InsideSubCard";
import UserInputButton from "../UI/Buttons/UserInputButton";

import { babyDogeAddress } from "../../ethereum/tokens/babyDoge";
import { babyLeashAddress } from "../../ethereum/tokens/babyLeash";
import { babyToyAddress } from "../../ethereum/tokens/babyToy";
import { wethAddress } from "../../ethereum/tokens/WETH";
import { convertEthToWei, convertWeiToEth, checkRouterAllowance } from "../../helpers/functionsHelper";
import factory from "../../ethereum/factory";
import router, { routerAddress } from "../../ethereum/router";
import compiledERC20 from "../../ethereum/contracts/periphery/build/ERC20.json";
import compiledUniswapV2Pair from "../../ethereum/contracts/core/build/UniswapV2Pair.json";
import { useAuthContext } from "../../store/auth-context";

import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import { makeStyles } from "@material-ui/core";

import babyDogeLogo from "../../public/babyDogeLogo.png";
import babyLeashLogo from "../../public/babyLeashLogo.png";
import babyToyLogo from "../../public/babyToyLogo.png";

import styles from "./RemoveLiquidityInput.module.css";
import web3 from "../../ethereum/web3";

function ValueLabelComponent(props) {
const { children, open, value } = props;

return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
    </Tooltip>
);
}
  
ValueLabelComponent.propTypes = {
children: PropTypes.element.isRequired,
open: PropTypes.bool.isRequired,
value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
    percentage: {
        fontSize: "2.5em",
        marginRight: "5%",
        color: "#f2f2f2"
    },
    selectAToken: {
        fontStyle: "italic",
        color: "#f2f2f2"
    },
    buttonPercentage: {
        backgroundColor: "#f2f2f2"
    },
    amountButton: {
        border: "1px #f2f2f2 solid",
        color: "#f2f2f2",
        "&:hover": {
            backgroundColor: "rgba(242, 242, 242, 1)",
            color: "#0ab5db"
        }
    },
    slider: {
        color: "#0ab5db"
    },
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
});

function RemoveLiquidityInput(props) {

    const initialValue = 50;
    const initialTokenState = {name: "", address: "", amount: ""};
    const slippage = 10 / 100;

    const [token, dispatchToken] = useReducer(tokenReducer, initialTokenState);
    const [token0Amount, setToken0Amount] = useState("");
    const [token1Amount, setToken1Amount] = useState("");
    const [liquidityToRemove, setLiquidityToRemove] = useState("");
    const [buttonMessage, setButtonMessage] = useState("Add Liquidity");
    const [isDisabled, setIsDisabled] = useState(false);

    const [percentageLPToken, setPercentageLPToken] = useState(initialValue);
    
    const authContext = useAuthContext();

    const classes = useStyles();
  
    function changePercentageHandler(event, value) {
        setPercentageLPToken(value);
    };

    function setPercentageTo25() {
        setPercentageLPToken(25);
        tokenAmountHandler(25);
    }

    function setPercentageTo50() {
        setPercentageLPToken(50);
        tokenAmountHandler(50);
    }

    function setPercentageTo75() {
        setPercentageLPToken(75);
        tokenAmountHandler(75);
    }

    function setPercentageToMax() {
        setPercentageLPToken(100);
        tokenAmountHandler(100);
    }

    function tokenReducer(state, action) {
        if(action.type === "ADD_BABYDOGE_ADDRESS") return { name: "BABYDOGE", address: babyDogeAddress };
        if(action.type === "ADD_BABYTOY_ADDRESS") return { name: "BABYTOY", address: babyToyAddress };
        if(action.type === "ADD_BABYLEASH_ADDRESS") return { name: "BABYLEASH", address: babyLeashAddress };
        if(action.type === "ADD_BABYDOGE_AMOUNT") return { name: "BABYDOGE", address: babyDogeAddress, amount: action.value };
        if(action.type === "ADD_BABYTOY_AMOUNT") return { name: "BABYTOY", address: babyToyAddress, amount: action.value };
        if(action.type === "ADD_BABYLEASH_AMOUNT") return { name: "BABYLEASH", address: babyLeashAddress, amount: action.value };
        if(action.type === "ADD_BNB_AMOUNT") return { name: "BNB", amount: action.value };
        return initialTokenState;
    }

    function chooseBabyDogeHandler() {
        dispatchToken({ type: "ADD_BABYDOGE_ADDRESS" });
    }

    function chooseBabyLeashHandler() {
        dispatchToken({ type: "ADD_BABYLEASH_ADDRESS" });
    }

    function chooseBabyToyHandler() {
        dispatchToken({ type: "ADD_BABYTOY_ADDRESS" });
    }

    async function getButtonMessage() {
        if(!token.name) {
            setIsDisabled(true);
            return "Select a token";
        }
        if(!liquidityToRemove) {
            setIsDisabled(true);
            return "Select an amount to withdraw";
        }

        const poolAddress = await factory.methods.getPair(token.address, wethAddress).call();
        const lpToken = await new web3.eth.Contract(compiledERC20.abi, poolAddress);

        const allowance = await lpToken.methods.allowance(authContext.accounts[0], routerAddress).call();
        const isRouterAllowed = parseFloat(allowance) > parseFloat(liquidityToRemove);
        if(isRouterAllowed) {
            setIsDisabled(false);
            return "Remove Liquidity";
        }
        if(!isRouterAllowed && token.name) {
            setIsDisabled(false);
            return `Approve ${token.name}`;
        }
    }
    
    useEffect(() => {
        async function changeMessageHandler() {
            const buttonIcon = <HighlightOffRoundedIcon className={classes.liquidityIcon} />;
            const message = await getButtonMessage();

            setButtonMessage(
                <Typography variant="h6" component="div" className={classes.liquidityButton} >
                    <Typography variant="h6" className={classes.liquidityButton} >{buttonIcon}</Typography>
                    {message}
                </Typography>);
        }
        changeMessageHandler();
    }, [token, token0Amount, token1Amount, liquidityToRemove, percentageLPToken]);

    async function tokenAmountHandler(percentage) {

        if(!token.address) return;

        const selectedPercentageLpToken = Number.isNaN(+percentage) ? percentageLPToken : percentage;

        const poolAddress = await factory.methods.getPair(token.address, wethAddress).call();
        const lpToken = await new web3.eth.Contract(compiledERC20.abi, poolAddress);
        const lpTokenTotalSupply = await lpToken.methods.totalSupply().call();

        const maxLiquidityToRemove = await lpToken.methods.balanceOf(authContext.accounts[0]).call();
        const currentLiquidityToRemove = maxLiquidityToRemove * (selectedPercentageLpToken / 100);
        setLiquidityToRemove(currentLiquidityToRemove);

        const uniswapV2Pair = await new web3.eth.Contract(compiledUniswapV2Pair.abi, poolAddress);
        const reserves = await uniswapV2Pair.methods.getReserves().call();
        const reserve0 = reserves[0];
        const reserve1 = reserves[1];
        setToken0Amount((currentLiquidityToRemove * reserve0) / lpTokenTotalSupply);
        setToken1Amount((currentLiquidityToRemove * reserve1) / lpTokenTotalSupply);
    }

    async function removeLiquidity() {

        const poolAddress = await factory.methods.getPair(token.address, wethAddress).call();
        const lpToken = await new web3.eth.Contract(compiledERC20.abi, poolAddress);

        const allowance = await lpToken.methods.allowance(authContext.accounts[0], routerAddress).call();
        const isRouterAllowed = parseFloat(allowance) > parseFloat(liquidityToRemove);
        
        if(!isRouterAllowed) {
            const infinite = BigInt(2**256) - BigInt(1);
            await lpToken.methods.approve(routerAddress, infinite).send({ from: authContext.accounts[0] });
        }

        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = await now.timestamp + 10000;


        if(isRouterAllowed && token0Amount !== 0) {
            await router.methods.removeLiquidityETH(
                `${token.address}`, 
                `${BigInt(liquidityToRemove)}`, 
                `${BigInt(token0Amount * (1 - slippage))}`, 
                `${BigInt(token1Amount * (1 - slippage))}`,
                authContext.accounts[0],
                deadline
            ).send({ from: authContext.accounts[0] });
        }
    }

    function returnBigNumber4Decimals(number) {
        return parseFloat(convertWeiToEth(BigInt(number))).toFixed(4);
    }

    return(
        <SubCard>
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Remove Liquidity</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">{token.name ? `Remove liquidity for ${token.name }` : <Typography variant="subtitle1" className={classes.selectAToken}>Select a token below</Typography>}</Typography>
            <InsideSubCard>
                <Typography variant="subtitle1" style={{fontSize: "1.5em"}} align="center" >Choose the token you want to withdraw liquidity from :</Typography>
                <div className={styles["choose-token"]} >
                    <Button
                        onClick={chooseBabyDogeHandler}
                        variant="contained"
                        className={classes.buttonPercentage}
                        startIcon={<Image src={babyDogeLogo} width="25px" height="25px" alt="babydoge logo" />}
                    >
                        BabyDoge
                    </Button>
                    <Button
                        onClick={chooseBabyToyHandler}
                        variant="contained"
                        className={classes.buttonPercentage}
                        startIcon={<Image src={babyToyLogo} width="25px" height="25px" alt="babydoge logo" />}
                    >
                        BabyToy
                    </Button>
                    <Button
                        onClick={chooseBabyLeashHandler}
                        variant="contained"
                        className={classes.buttonPercentage}
                        startIcon={<Image src={babyLeashLogo} width="25px" height="25px" alt="babydoge logo" />}
                    >
                        BabyLeash
                    </Button>
                </div>
                <Typography variant="subtitle1" style={{fontSize: "1.5em"}} align="center" >Select the amount of liquidity you want to withdraw :</Typography>
                <div className={styles["choose-amount"]} >
                    <Typography className={classes.percentage}>{`${percentageLPToken}%`}</Typography>
                    <Slider
                        ValueLabelComponent={ValueLabelComponent}
                        value={percentageLPToken}
                        onChangeCommitted={tokenAmountHandler}
                        onChange={changePercentageHandler}
                        aria-label="custom thumb label"
                        defaultValue={initialValue}
                        className={classes.slider}
                    />
                </div>
                <div className={styles["choose-token"]}>
                    <Button variant="outlined" className={classes.amountButton} onClick={setPercentageTo25}>25%</Button>
                    <Button variant="outlined" className={classes.amountButton} onClick={setPercentageTo50}>50%</Button>
                    <Button variant="outlined" className={classes.amountButton} onClick={setPercentageTo75}>75%</Button>
                    <Button variant="outlined" className={classes.amountButton} onClick={setPercentageToMax}>Max</Button>
                </div>
            </InsideSubCard>
            <div className={styles["display-arrow"]} ><ArrowDownwardRoundedIcon /></div>
            <InsideSubCard>
                <Typography variant="subtitle1" align="right" style={{fontSize: "1.5em"}} className={styles.amounts} >{`${returnBigNumber4Decimals(token0Amount)} ${token.name}`}</Typography>
                <Typography variant="subtitle1" align="right" style={{fontSize: "1.5em"}} className={styles.amounts} >{`${returnBigNumber4Decimals(token1Amount)} BNB`}</Typography>
            </InsideSubCard>
            <UserInputButton onClick={removeLiquidity} disabled={isDisabled} message={buttonMessage} />
        </SubCard>
    );
}

export default RemoveLiquidityInput;