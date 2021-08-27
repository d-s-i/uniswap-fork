const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/contracts/core/build/UniswapV2Factory.json");
const compiledERC20 = require("../ethereum/contracts/core/build/ERC20.json");
const compiledIUniswapV2Pair = require("../ethereum/contracts/core/build/IUniswapV2Pair.json");
const compiledRouter = require("../ethereum/contracts/periphery/build/UniswapV2Router02.json");
const compiledWETH = require("../ethereum/contracts/periphery/build/WETH9.json");
const compiledYieldFarming = require("../ethereum/contracts/migrator/build/YieldFarming.json");
const compiledBonusToken = require("../ethereum/contracts/migrator/build/BonusToken.json");

let accounts;
let factory;
let token1;
let WETH;
let token1Address;
let router;
let poolAddress;
let wethAddress;
let factoryAddress;
let blockNumber;
let now;
let routerAddress;
let deadline;
let lpToken;

const ethToWei = (ethAmount) => web3.utils.toWei(`${ethAmount}`, "ether");

beforeEach(async function() {
    accounts = await web3.eth.getAccounts();

    token1 = await new web3.eth.Contract(compiledERC20.abi).deploy({ data: compiledERC20.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });
    token1Address = token1.options.address;
    WETH = await new web3.eth.Contract(compiledWETH.abi).deploy({ data: compiledWETH.evm.bytecode.object }).send({ from: accounts[0], gas: "1000000" });
    wethAddress = WETH.options.address;
    bonusToken = await new web3.eth.Contract(compiledBonusToken.abi).deploy({ data: compiledBonusToken.evm.bytecode.object }).send({ from: accounts[0], gas: "1000000" });
    bonusTokenAddress = bonusToken.options.address;

    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({ data: compiledFactory.evm.bytecode.object, arguments: [accounts[0]] }).send({ from: accounts[0], gas: "3000000" });
    factoryAddress = factory.options.address;
    // const INIT_CODE_HASH = await factory.methods.INIT_CODE_PAIR_HASH().call();

    router = await new web3.eth.Contract(compiledRouter.abi).deploy({ data: compiledRouter.evm.bytecode.object, arguments: [factoryAddress, wethAddress] }).send({ from: accounts[0], gas: "4000000" });
    routerAddress = router.options.address;

    await factory.methods.createPair(token1Address, wethAddress).send({ from: accounts[0], gas: "3000000" });
    poolAddress = await factory.methods.getPair(token1Address, wethAddress).call();

    await WETH.methods.deposit().send({ from: accounts[0], gas: "1000000", value: ethToWei(5) });

    await token1.methods.approve(routerAddress, "100").send({ from: accounts[0], gas: "1000000" });
    await WETH.methods.approve(routerAddress, ethToWei(100)).send({ from: accounts[0], gas: "1000000" });

    lpToken = await new web3.eth.Contract(compiledIUniswapV2Pair.abi, poolAddress);

    blockNumber = await web3.eth.getBlockNumber();
    now = await web3.eth.getBlock(blockNumber);
    deadline = now.timestamp + 100000;

    await router.methods
    .addLiquidityETH(token1Address, "30", "30", ethToWei(30), accounts[0], deadline)
    .send({ from: accounts[0], gas: "3000000", value: ethToWei(30) });

    yieldFarming = await new web3.eth.Contract(compiledYieldFarming.abi)
    .deploy({ data: compiledYieldFarming.evm.bytecode.object, arguments: [lpToken.options.address, bonusTokenAddress] })
    .send({ from: accounts[0], gas: "4000000" });
    yieldFarmingAddress = yieldFarming.options.address;
    
});

describe("Yield Farming", async function() {
    async function depositTokens() {
        const liquidity = await lpToken.methods.balanceOf(accounts[0]).call();
        await lpToken.methods.approve(yieldFarmingAddress, liquidity).send({from: accounts[0], gas: "1000000"});
        await yieldFarming.methods.stake(liquidity).send({from: accounts[0], gas: "1000000"});
        return liquidity;
    }
    // it("deposit LP tokens", async function() {
    //     await depositTokens();
    //     const yieldFarmingBalances = await lpToken.methods.balanceOf(yieldFarmingAddress).call();
    //     const depositedAmount = await yieldFarming.methods.depositedAmount(accounts[0]).call();
    //     assert.ok(yieldFarmingBalances > 0 && depositedAmount === yieldFarmingBalances);
    // });
    // it("withdraw Lp Tokens", async function() {
    //     const liquidity = await depositTokens();
    //     await yieldFarming.methods.unstake(liquidity).send({from: accounts[0], gas: "1000000"});
    //     const liquidity2 = await lpToken.methods.balanceOf(yieldFarmingAddress).call();
    //     assert.ok(liquidity2 === "0");
    // });
    // it("doesn't withdraw from another account", async function() {
    //     const liquidity = await depositTokens();
    //     console.log(await yieldFarming.methods.depositedAmount(accounts[1]).call());
    //     console.log(await yieldFarming.methods.depositedAmount(accounts[0]).call());
    //     await yieldFarming.methods.unstake(liquidity).send({from: accounts[1], gas: "1000000"});
    //     assert.ok(await lpToken.methods.balanceOf(accounts[1]).call() === "0");
    // });
    it("distribute rewards on withdraw", async function() {
        const liquidity = await depositTokens();
        await lpToken.methods.approve(yieldFarmingAddress, liquidity).send({from: accounts[0], gas: "1000000"});
        function advanceBlock() {
            return new Promise((resolve, reject) => {
              web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: new Date().getTime()
              }, (err, result) => {
                if (err) { return reject(err) }
                const newBlockHash = web3.eth.getBlock('latest').hash
        
                return resolve(newBlockHash)
              });
            });
        }

        for(let i = 0; i <= 15; i++) {
            advanceBlock();
        }

        await bonusToken.methods.setLiquidator(yieldFarmingAddress).send({ from: accounts[0], gas: "1000000" });

        await yieldFarming.methods.unstake(liquidity).send({from: accounts[0], gas: "1000000"});
        await yieldFarming.methods.withdrawRewards().send({from: accounts[0], gas: "1000000"});
        const bonusBalances = await bonusToken.methods.balanceOf(accounts[0]).call();
        console.log(bonusBalances);
    });
    // it("update blocks", async function() {
    //     const block1 = await web3.eth.getBlockNumber();
    //     let now = await web3.eth.getBlock(block1);
    //     console.log("block1", block1, now.timestamp);

    //     const advanceBlock = () => {
    //         return new Promise((resolve, reject) => {
    //           web3.currentProvider.send({
    //             jsonrpc: '2.0',
    //             method: 'evm_mine',
    //             id: new Date().getTime()
    //           }, (err, result) => {
    //             if (err) { return reject(err) }
    //             const newBlockHash = web3.eth.getBlock('latest').hash
          
    //             return resolve(newBlockHash)
    //           })
    //         })
    //     }

    //     advanceBlock();
    //     advanceBlock();
    //     advanceBlock();
    //     advanceBlock();
    //     advanceBlock();

    //     const block2 = await web3.eth.getBlockNumber();
    //     now = await web3.eth.getBlock(block2);
    //     console.log("block2", block2, now.timestamp);
        
    //     // assert.ok(block1 !== block2);
    // });
});

// describe("Deploy environment", function() {
//     it("deploy two tokens", () => {
//         assert.ok(token1Address);
//         assert.ok(token2Address);
//     });
//     it("deploy the factory", () => {
//         assert.ok(factory.options.address);
//     });
//     it("deploy a liquidity pool", () => {
//         assert.ok(poolAddress);
//     });
//     it("deploy weth", () => {
//         assert.ok(WETH.options.address);
//     });
//     it("deploy router", () => {
//         assert.ok(router.options.address);
//     })
// });

// describe("Use router", function() {
//     it("adds liquidity", async () => {
//         assert.ok(await token1.methods.balanceOf(poolAddress).call() > 0 && await WETH.methods.balanceOf(poolAddress).call() > 0);
//     });

//     it("make a swap", async () => {
//         console.log(await token1.methods.balanceOf(accounts[1]).call());
//         await router.methods.swapExactETHForTokens(1, [wethAddress, token1Address], accounts[1], deadline).send({ from: accounts[1], gas:"1000000", value: ethToWei(2) });
//         assert.ok(await token1.methods.balanceOf(accounts[1]).call() > 0);
//     });

//     it("remove liquidity", async () => {
//         const liquidity = await lpToken.methods.balanceOf(accounts[0]).call();

//         console.log(await token1.methods.balanceOf(poolAddress).call());

//         await lpToken.methods.approve(routerAddress, liquidity).send({ from: accounts[0], gas: "1000000" });
//         await router.methods.removeLiquidityETH(token1Address, `${liquidity}`, "29.9", ethToWei(30.9), accounts[0], deadline).send({ from: accounts[0], gas: "1000000" });

//         assert.ok(await token1.methods.balanceOf(poolAddress).call() < 30 && await WETH.methods.balanceOf(poolAddress).call() < ethToWei(30));
//     });

//     it("recolt fees", async () => {
//         console.log(factory.methods);

//         const [,amountOutEthToToken] = await router.methods.getAmountsOut(ethToWei(5), [wethAddress, token1Address]).call();
        
//         await token1.methods.approve(routerAddress, "100").send({ from: accounts[1], gas: "1000000" });
//         await WETH.methods.approve(routerAddress, "100").send({ from: accounts[1], gas: "1000000" });
        
//         await router.methods.swapExactETHForTokens(amountOutEthToToken, [wethAddress, token1Address], accounts[1], deadline).send({ from: accounts[1], gas:"1000000", value: ethToWei(5) });
//         const [,amountOutTokenToEth] = await router.methods.getAmountsOut(4, [token1Address, wethAddress]).call();
//         await router.methods.swapExactTokensForETH(4, amountOutTokenToEth, [token1Address, wethAddress], accounts[1], deadline).send({ from: accounts[1], gas:"1000000" });
//         assert.ok(await WETH.methods.balanceOf(poolAddress).call() > ethToWei(30));
//     });

// });
