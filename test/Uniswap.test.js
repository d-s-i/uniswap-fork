const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/contracts/core/build/UniswapV2Factory.json");
const compiledERC20 = require("../ethereum/contracts/core/build/ERC20.json");
const compiledIUniswapV2Pair = require("../ethereum/contracts/core/build/IUniswapV2Pair.json");
const compiledRouter = require("../ethereum/contracts/periphery/build/UniswapV2Router02.json");
const compiledWETH = require("../ethereum/contracts/periphery/build/WETH9.json");
const compiledYieldFarmingBabYDoge = require("../ethereum/contracts/migrator/build/YieldFarmingBabyDoge.json");
const compiledBabyLeashToken = require("../ethereum/contracts/periphery/build/BabyLeash.json");
const compiledBabyDogeToken = require("../ethereum/contracts/periphery/build/BabyDoge.json");

let accounts;
let factory;
let babyDoge;
let WETH;
let babyDogeAddress;
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

    babyDoge = await new web3.eth.Contract(compiledBabyDogeToken.abi).deploy({ data: compiledBabyDogeToken.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });
    babyDogeAddress = babyDoge.options.address;
    WETH = await new web3.eth.Contract(compiledWETH.abi).deploy({ data: compiledWETH.evm.bytecode.object }).send({ from: accounts[0], gas: "1000000" });
    wethAddress = WETH.options.address;
    babyLeash = await new web3.eth.Contract(compiledBabyLeashToken.abi).deploy({ data: compiledBabyLeashToken.evm.bytecode.object, arguments: [10000] }).send({ from: accounts[0], gas: "1000000" });
    babyLeashAddress = babyLeash.options.address;

    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({ data: compiledFactory.evm.bytecode.object, arguments: [accounts[0]] }).send({ from: accounts[0], gas: "3000000" });
    factoryAddress = factory.options.address;
    // const INIT_CODE_HASH = await factory.methods.INIT_CODE_PAIR_HASH().call();

    router = await new web3.eth.Contract(compiledRouter.abi).deploy({ data: compiledRouter.evm.bytecode.object, arguments: [factoryAddress, wethAddress] }).send({ from: accounts[0], gas: "4000000" });
    routerAddress = router.options.address;

    await factory.methods.createPair(babyDogeAddress, wethAddress).send({ from: accounts[0], gas: "3000000" });
    poolAddress = await factory.methods.getPair(babyDogeAddress, wethAddress).call();

    await babyDoge.methods.approve(routerAddress, "100").send({ from: accounts[0], gas: "1000000" });
    await WETH.methods.approve(routerAddress, ethToWei(100)).send({ from: accounts[0], gas: "1000000" });

    lpToken = await new web3.eth.Contract(compiledIUniswapV2Pair.abi, poolAddress);

    blockNumber = await web3.eth.getBlockNumber();
    now = await web3.eth.getBlock(blockNumber);
    deadline = now.timestamp + 100000;

    await router.methods
      .addLiquidityETH(babyDogeAddress, "30", "30", ethToWei(30), accounts[0], deadline)
      .send({ from: accounts[0], gas: "3000000", value: ethToWei(30) });

    yieldFarming = await new web3.eth.Contract(compiledYieldFarmingBabYDoge.abi)
      .deploy({ data: compiledYieldFarmingBabYDoge.evm.bytecode.object, arguments: [lpToken.options.address, babyLeashAddress] })
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
    it("update depositedAmount correctly", async function() {
      const liquidity = await depositTokens();
      const depositedAmount0 = await yieldFarming.methods.depositedAmount(accounts[0]).call();
      console.log(depositedAmount0);

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

      for(let i = 0; i <= 150; i++) {
        advanceBlock();
      }

      await babyLeash.methods.setAllowedMinter(yieldFarmingAddress).send({ from: accounts[0], gas: "1000000" });
      
      console.log("yield time", await yieldFarming.methods.calculateYieldTime(accounts[0]).call());
      const toTransfer = await yieldFarming.methods.calculateYieldTotal(accounts[0]).call();
      console.log("yield total", toTransfer);
      const rewards = await yieldFarming.methods.rewards(accounts[0]).call();
      console.log(rewards);
      console.log("require: ", toTransfer > 0 || rewards[msg.sender] > 0)

      await yieldFarming.methods.unstake(liquidity).send({ from: accounts[0], gas: "1000000" });
      const depositedAmount1 = await yieldFarming.methods.depositedAmount(accounts[0]).call();
      console.log(depositedAmount1);
    })
    // it("withdraw Lp Tokens", async function() {
    //     const liquidity = await depositTokens();
    //     function advanceBlock() {
    //       return new Promise((resolve, reject) => {
    //         web3.currentProvider.send({
    //           jsonrpc: '2.0',
    //           method: 'evm_mine',
    //           id: new Date().getTime()
    //         }, (err, result) => {
    //           if (err) { return reject(err) }
    //           const newBlockHash = web3.eth.getBlock('latest').hash
      
    //           return resolve(newBlockHash)
    //         });
    //       });
    //     }

    //     for(let i = 0; i <= 150; i++) {
    //       advanceBlock();
    //     }
    //     await yieldFarming.methods.unstake(liquidity).send({from: accounts[0], gas: "1000000"});
    //     const YieldFarmingContractliquidityBalance = await lpToken.methods.balanceOf(yieldFarmingAddress).call();
    //     const MyLiquidityBalance = await lpToken.methods.balanceOf(accounts[0]).call();
    //     assert.ok(YieldFarmingContractliquidityBalance === "0" && MyLiquidityBalance !== "0");
    // });
    // it("doesn't withdraw from another account", async function() {
    //     const liquidity = await depositTokens();
    //     console.log(await yieldFarming.methods.depositedAmount(accounts[1]).call());
    //     console.log(await yieldFarming.methods.depositedAmount(accounts[0]).call());
    //     await yieldFarming.methods.unstake(liquidity).send({from: accounts[1], gas: "1000000"});
    //     assert.ok(await lpToken.methods.balanceOf(accounts[1]).call() === "0");
    // });
    // it("distribute rewards on withdraw", async function() {
    //     const liquidity = await depositTokens();
    //     await lpToken.methods.approve(yieldFarmingAddress, liquidity).send({from: accounts[0], gas: "1000000"});
    //     const block1 = await web3.eth.getBlockNumber();
    //     let time = await web3.eth.getBlock(block1);
    //     console.log("block1", block1, time.timestamp);
    //     function advanceBlock() {
    //         return new Promise((resolve, reject) => {
    //           web3.currentProvider.send({
    //             jsonrpc: '2.0',
    //             method: 'evm_mine',
    //             id: new Date().getTime()
    //           }, (err, result) => {
    //             if (err) { return reject(err) }
    //             const newBlockHash = web3.eth.getBlock('latest').hash
        
    //             return resolve(newBlockHash)
    //           });
    //         });
    //     }

    //     for(let i = 0; i <= 150; i++) {
    //         advanceBlock();
    //     }

    //     const block2 = await web3.eth.getBlockNumber();
    //     time = await web3.eth.getBlock(block1);
    //     console.log("block2", block2, time.timestamp);

    //     await babyLeash.methods.setAllowedMinter(yieldFarmingAddress).send({ from: accounts[0], gas: "1000000" });

    //     const depositedAmount0 = await yieldFarming.methods.depositedAmount(accounts[0]).call();
    //     console.log("depositedAmount0", depositedAmount0);
    //     const yieldTotal = await yieldFarming.methods.calculateYieldTotal(accounts[0]).call();
    //     console.log("yield: ", yieldTotal);

    //     await yieldFarming.methods.unstake(liquidity).send({from: accounts[0], gas: "1000000"});
    //     const depositedAmount1 = await yieldFarming.methods.depositedAmount(accounts[0]).call();
    //     console.log("depositedAmount1", depositedAmount1);
    //     // const test = await yieldFarming.methods.withdrawRewards().send({from: accounts[0], gas: "1000000"});
    //     // console.log(test);
    //     // await yieldFarming.methods.withdrawRewards().send({from: accounts[0], gas: "1000000"});
    //     // await yieldFarming.methods.withdrawRewards().send({from: accounts[0], gas: "1000000"});
    //     // const bonusBalances = await babyLeash.methods.balanceOf(accounts[0]).call();
    //     // console.log(bonusBalances);

    //     assert.ok(depositedAmount0 !== depositedAmount1);
    // });
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
//         assert.ok(babyDogeAddress);
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
//         assert.ok(await babyDoge.methods.balanceOf(poolAddress).call() > 0 && await WETH.methods.balanceOf(poolAddress).call() > 0);
//     });

//     it("make a swap", async () => {
//         console.log(await babyDoge.methods.balanceOf(accounts[1]).call());
//         await router.methods.swapExactETHForTokens(1, [wethAddress, babyDogeAddress], accounts[1], deadline).send({ from: accounts[1], gas:"1000000", value: ethToWei(2) });
//         assert.ok(await babyDoge.methods.balanceOf(accounts[1]).call() > 0);
//     });

//     it("remove liquidity", async () => {
//         const liquidity = await lpToken.methods.balanceOf(accounts[0]).call();

//         console.log(await babyDoge.methods.balanceOf(poolAddress).call());

//         await lpToken.methods.approve(routerAddress, liquidity).send({ from: accounts[0], gas: "1000000" });
//         await router.methods.removeLiquidityETH(babyDogeAddress, `${liquidity}`, "29.9", ethToWei(30.9), accounts[0], deadline).send({ from: accounts[0], gas: "1000000" });

//         assert.ok(await babyDoge.methods.balanceOf(poolAddress).call() < 30 && await WETH.methods.balanceOf(poolAddress).call() < ethToWei(30));
//     });

//     it("recolt fees", async () => {
//         console.log(factory.methods);

//         const [,amountOutEthToToken] = await router.methods.getAmountsOut(ethToWei(5), [wethAddress, babyDogeAddress]).call();
        
//         await babyDoge.methods.approve(routerAddress, "100").send({ from: accounts[1], gas: "1000000" });
//         await WETH.methods.approve(routerAddress, "100").send({ from: accounts[1], gas: "1000000" });
        
//         await router.methods.swapExactETHForTokens(amountOutEthToToken, [wethAddress, babyDogeAddress], accounts[1], deadline).send({ from: accounts[1], gas:"1000000", value: ethToWei(5) });
//         const [,amountOutTokenToEth] = await router.methods.getAmountsOut(4, [babyDogeAddress, wethAddress]).call();
//         await router.methods.swapExactTokensForETH(4, amountOutTokenToEth, [babyDogeAddress, wethAddress], accounts[1], deadline).send({ from: accounts[1], gas:"1000000" });
//         assert.ok(await WETH.methods.balanceOf(poolAddress).call() > ethToWei(30));
//     });

// });
