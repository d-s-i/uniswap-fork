const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/contracts/core/build/UniswapV2Factory.json");
const compiledERC20 = require("../ethereum/contracts/core/build/ERC20.json");

let accounts;
let erc20Contract;
let factory ;
let token1;
let token2;
let token1Address;
let token2Address;
let poolAddress;

beforeEach(async function() {
    accounts = await web3.eth.getAccounts();

    // console.log(compiledFactory.evm.gasEstimates.creation);

    token1 = await new web3.eth.Contract(compiledERC20.abi).deploy({ data: compiledERC20.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });
    token2 = await new web3.eth.Contract(compiledERC20.abi).deploy({ data: compiledERC20.evm.bytecode.object, arguments: [100] }).send({ from: accounts[0], gas: "1000000" });

    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({ data: compiledFactory.evm.bytecode.object, arguments: [accounts[0]] }).send({ from: accounts[0], gas: "1000000" });

    token1Address = token1.options.address;
    token2Address = token2.options.address;

    // poolAddress = factory.methods.createPair(token1Address, token2Address);
});

describe("Tokens", function() {
    it("deploy two tokens", () => {
        assert.ok(token1.options.address);
        assert.ok(token2.options.address);
    });
});

describe("Factory", function() {
    it("deploy the factory", () => {
        assert.ok(factory);
    });
    it("deploy a liquidity pool", () => {
        assert.ok(poolAddress);
    });
});