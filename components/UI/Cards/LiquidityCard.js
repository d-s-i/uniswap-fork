import { useState, useEffect } from "react";
import { useAddLiquidityContext } from "../../../store/addLiquidity-context";
import { useAuthContext } from "../../../store/auth-context";

import web3 from "../../../ethereum/web3";
import router, { routerAddress } from "../../../ethereum/router";
import babyDoge from "../../../ethereum/tokens/babyDoge";
import babyToy from "../../../ethereum/tokens/babyToy";
import babyLeash from "../../../ethereum/tokens/babyLeash";
import { convertEthToWei } from "../../../helpers/functionsHelper";

import Typography from "@material-ui/core/Typography";
import LiquidityFormTokenInput from "../../LiquidityInput/LiquidityFormTokenInput";
import UserInputButton from "../Buttons/UserInputButton";

import styles from "./LiquidityCard.module.css";

function LiquidityCard(props) {

    const [buttonMessage, setButtonMessage] = useState("Add Liquidity");
    const [isDisabled, setisDisabled] = useState(true);

    
    const liquidityContext = useAddLiquidityContext();
    const authContext = useAuthContext();

    const tokenName = liquidityContext.token0.name;
    const token0Amount = liquidityContext.token0.amount;
    const token1Amount = liquidityContext.token1.amount;

    const slippage = 50 / 100;
    
    useEffect(() => {
        async function changeMessageHandler() {
            const isAllowed = await checkRouterAllowance(liquidityContext.token0.name);
            let message;
            if(isAllowed) {
                message = "Add Liquidity";
            }
            if(!isAllowed) {
                message = `Approve ${liquidityContext.token0.name}`;
            }
            if(!token0Amount) {
                message = `Enter a ${tokenName} amount`;
            }
            if(!token1Amount) {
                message = "Enter a BNB amount";
            }
            setButtonMessage(message);
        }
        changeMessageHandler();
    }, [liquidityContext.token0.name, liquidityContext.token1.name]);


    async function checkRouterAllowance(token) {
        if(token0Amount !== "") {
            if(token === "BABYDOGE") {
                const allowance = await babyDoge.methods.allowance(authContext.accounts[0], routerAddress).call();
                return parseFloat(allowance) > parseFloat(convertEthToWei(token0Amount));
            }
            if(token === "BABYTOY") {
                const allowance = await babyToy.methods.allowance(authContext.accounts[0], routerAddress).call();
                return parseFloat(allowance) > parseFloat(convertEthToWei(token0Amount));
            }
            if(token === "BABYLEASH") {
                const allowance = await babyLeash.methods.allowance(authContext.accounts[0], routerAddress).call();
                return parseFloat(allowance) > parseFloat(convertEthToWei(token0Amount));
            }
        }
    }

    async function addLiquidity() {
        const accounts = await web3.eth.getAccounts();

        const blockNumber = await web3.eth.getBlockNumber();
        const now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 10000;

        const isRouterAllowed = await checkRouterAllowance(tokenName);

        if(isRouterAllowed && token0Amount !== 0) {
            await router.methods
                .addLiquidityETH(
                    `${liquidityContext.token0.address}`, 
                    `${convertEthToWei(token0Amount)}`, 
                    `${Math.trunc(convertEthToWei(token0Amount*(1-slippage)))}`, // commented because  I have a problem, token0Amount is 1 wei when calculated from the quote function, so token0Amount*(1-slippage) === 0.5 wei ...
                    `${Math.trunc(convertEthToWei(token1Amount*(1-slippage)))}`,  // need to resolve the quote problem and getting a real value
                    accounts[0], 
                    deadline)
                .send({ 
                        from: accounts[0], 
                        value: convertEthToWei(token1Amount) 
                    }); // AJOUTER DU SLIPPAGE DYNAMIQUE
        }
        if(!isRouterAllowed && parseFloat(token0Amount) !== 0) {
            const infinite = BigInt(2**256) - BigInt(1);
            if(tokenName === "BABYDOGE") {
                await babyDoge.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
            }
            if(tokenName === "BABYTOY") {
                await babyToy.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
            }
            if(tokenName === "BABYLEASH") {
                await babyLeash.methods.approve(routerAddress, infinite).send({ from: accounts[0] });
            }
            liquidityContext.onToken0Change({ approved : true });
        }
    }

    useEffect(() => {
        setisDisabled(parseFloat(token0Amount) === 0 || parseFloat(token1Amount) === 0 || token0Amount === "" || token1Amount === "");
    }, [token0Amount, token1Amount]);

    // async function removeLiquidity() {
    //     const poolAddress = "0xffC80955188962146C53aB98eb3E409D8A17c7D0";
    //     const babyDogeAddress = "0x76c51246641F711aAAe87C8Ef2C95da186798FB2";
    //     const lpToken = await new web3.eth.Contract(compiledERC20.abi, poolAddress);
    //     const liquidity = await lpToken.methods.balanceOf(authContext.accounts[0]).call();
    //     const allowance = await lpToken.methods.allowance(authContext.accounts[0], routerAddress).call();
    //     if(parseFloat(allowance) < parseFloat(liquidity)) {
    //         await lpToken.methods.approve(routerAddress, convertEthToWei(2^256 - 1)).send({ from: authContext.accounts[0] });
    //     }
    //     const blockNumber = await web3.eth.getBlockNumber();
    //     const now = await web3.eth.getBlock(blockNumber);
    //     const deadline = await now.timestamp + 10000;
    //     await router.methods.removeLiquidityETH(babyDogeAddress, liquidity , "0", web3.utils.toWei("1", "ether"), authContext.accounts[0], deadline).send({ from: authContext.accounts[0] })
    // }

    return(
        <div className={styles["swap-container"]} >
            <Typography style={{ fontWeight: "bold" }} className={styles["card-title"]} variant="h4">Add Liquidity</Typography>
            <Typography className={styles["card-subtitle"]} variant="subtitle1">
                {`Provide liquidity for ${liquidityContext.token0.name || "--"}/${liquidityContext.token1.name || "--"} in the community liquidity pool!`}
            </Typography>
            <LiquidityFormTokenInput />
            <UserInputButton onClick={addLiquidity} disabled={isDisabled} message={buttonMessage} />
            {/* <button onClick={removeLiquidity} >remove</button> */}
        </div>
    );
}

export default LiquidityCard;