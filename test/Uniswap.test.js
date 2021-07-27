const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/contracts/core/build/UniswapV2Factory.json");
const compiledERC20 = require("../ethereum/contracts/core/build/ERC20.json");
const compiledRouter = require("../ethereum/contracts/periphery/build/UniswapV2Router02.json");
const compiledWETH = require("../ethereum/contracts/periphery/build/WETH9.json");

let accounts;
let factory ;
let token1;
let token2;
let WETH;
let token1Address;
let token2Address;
let router;
let poolAddress;
let wethAddress;
let factoryAddress;
let blockNumber;
let now;
let routerAddress;

const ethToWei = (ethAmount) => web3.utils.toWei(`${ethAmount}`, "ether");

beforeEach(async function() {
    accounts = await web3.eth.getAccounts();

    token1 = await new web3.eth.Contract(compiledERC20.abi).deploy({ data: compiledERC20.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });
    token2 = await new web3.eth.Contract(compiledERC20.abi).deploy({ data: compiledERC20.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });
    WETH = await new web3.eth.Contract(compiledWETH.abi).deploy({ data: compiledWETH.evm.bytecode.object }).send({ from: accounts[0], gas: "1000000" });
    wethAddress = WETH.options.address;

    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({ data: compiledFactory.evm.bytecode.object, arguments: [accounts[0]] }).send({ from: accounts[0], gas: "3000000" });
    factoryAddress = factory.options.address;

    router = await new web3.eth.Contract(compiledRouter.abi).deploy({ data: compiledRouter.evm.bytecode.object, arguments: [factoryAddress, wethAddress] }).send({ from: accounts[0], gas: "4000000" });

    token1Address = token1.options.address;
    token2Address = token2.options.address;
    routerAddress = router.options.address;

    await factory.methods.createPair(token1Address, wethAddress).send({ from: accounts[0], gas: "3000000" });
    poolAddress = await factory.methods.getPair(token1Address, wethAddress).call();

    await WETH.methods.deposit().send({ from: accounts[0], gas: "1000000", value: ethToWei(5) });

    await token1.methods.approve(routerAddress, "100").send({ from: accounts[0], gas: "1000000" });
    await WETH.methods.approve(routerAddress, ethToWei(100)).send({ from: accounts[0], gas: "1000000" });
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

describe("Use pool contracts", function() {
    it("adds liquidity", async () => {
        blockNumber = await web3.eth.getBlockNumber();
        now = await web3.eth.getBlock(blockNumber);
        const deadline = now.timestamp + 100000;
        
        const tx = await router.methods
        .addLiquidityETH(token1Address, "10", "10", 1, accounts[0], deadline)
        .send({ from: accounts[0], gas: "3000000", value: ethToWei(1) });

        console.log(tx);
        // assert.ok(await web3.eth.getBalance(poolAddress));
    });
});
