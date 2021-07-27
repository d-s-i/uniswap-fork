"use-strict";

const path = require("path");
const solc = require("solc"); //don"t forget to install the right solc version !
const fs = require("fs-extra");

// ETERNAL
const TransferHelperSourceCode = fs.readFileSync("../../../node_modules/@uniswap/lib/contracts/libraries/TransferHelper.sol");
const IUniswapV2FactorySourceCode = fs.readFileSync("../../../node_modules/@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol");
const IUniswapV2PairSourceCode = fs.readFileSync("../../../node_modules/@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol");
const BabylonianSourceCode = fs.readFileSync("../../../node_modules/@uniswap/lib/contracts/libraries/Babylonian.sol");
const FullMathSourceCode = fs.readFileSync("../../../node_modules/@uniswap/lib/contracts/libraries/FullMath.sol");
const FixedPointSourceCode = fs.readFileSync("../../../node_modules/@uniswap/lib/contracts/libraries/FixedPoint.sol");
const BitMathSourceCode = fs.readFileSync("../../../node_modules/@uniswap/lib/contracts/libraries/BitMath.sol");

//ROOT
const UniswapV2MigratorSourceCode = fs.readFileSync("./UniswapV2Migrator.sol");
const UniswapV2Router01rSourceCode = fs.readFileSync("./UniswapV2Router01.sol");
const UniswapV2Router02rSourceCode = fs.readFileSync("./UniswapV2Router02.sol");

// TEST FOLDER
const WETH9SourceCode = fs.readFileSync("./test/WETH9.sol");
const RouterEventEmitterSourceCode = fs.readFileSync("./test/RouterEventEmitter.sol");
const ERC20SourceCode = fs.readFileSync("./test/ERC20.sol");
const DeflatingERC20SourceCode = fs.readFileSync("./test/DeflatingERC20.sol");

// LIBRARIES FOLDER
const SafeMathSourceCode = fs.readFileSync("./libraries/SafeMath.sol");
const UniswapV2LibrarySourceCode = fs.readFileSync("./libraries/UniswapV2Library.sol");
const UniswapV2LiquidityMathLibrarySourceCode = fs.readFileSync("./libraries/UniswapV2LiquidityMathLibrary.sol");
const UniswapV2OracleLibrarySourceCode = fs.readFileSync("./libraries/UniswapV2OracleLibrary.sol");

// INTERFACES FOLDER
// V1 folder
const IUniswapV1ExchangeSourceCode = fs.readFileSync("./interfaces/V1/IUniswapV1Exchange.sol");
const IUniswapV1FactorySourceCode = fs.readFileSync("./interfaces/V1/IUniswapV1Factory.sol");
//root folder
const IERC20SourceCode = fs.readFileSync("./interfaces/IERC20.sol");
const IUniswapV2MigratorSourceCode = fs.readFileSync("./interfaces/IUniswapV2Migrator.sol");
const IUniswapV2Router01SourceCode = fs.readFileSync("./interfaces/IUniswapV2Router01.sol");
const IUniswapV2Router02SourceCode = fs.readFileSync("./interfaces/IUniswapV2Router02.sol");
const IWETHSourceCode = fs.readFileSync("./interfaces/IWETH.sol");


const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

function compileContract(Contract) {
    const contractPath = path.resolve(__dirname, ...Contract);  
    
    const contractSourceCode = fs.readFileSync(contractPath, "utf8");
    
    fs.ensureDirSync(buildPath);

    var input = {
        language: "Solidity",
        sources: {
            Contract: {
                content: contractSourceCode
            }
        },
        settings: {
            optimizer: {
                enabled: true
            },
            outputSelection: {
                "*": {
                    "*": [ "*" ]
                }
            }
        }
    };

    function findImports(path) {
        if (path === "test/ERC20.sol") return { contents: `${ERC20SourceCode}` };
        if (path === "test/RouterEventEmitter.sol") return { contents: `${RouterEventEmitterSourceCode}` };
        if (path === "test/WETH9.sol") return { contents: `${WETH9SourceCode}` };
        if (path === "test/DeflatingERC20.sol") return { contents: `${DeflatingERC20SourceCode}` };

        if (path === "interfaces/V1/IUniswapV1Exchange.sol") return { contents: `${IUniswapV1ExchangeSourceCode}` };
        if (path === "interfaces/V1/IUniswapV1Factory.sol") return { contents: `${IUniswapV1FactorySourceCode}` };
        if (path === "interfaces/IERC20.sol") return { contents: `${IERC20SourceCode}` };
        if (path === "interfaces/IUniswapV2Migrator.sol") return { contents: `${IUniswapV2MigratorSourceCode}` };
        if (path === "interfaces/IUniswapV2Router01.sol") return { contents: `${IUniswapV2Router01SourceCode}` };
        if (path === "interfaces/IUniswapV2Router02.sol") return { contents: `${IUniswapV2Router02SourceCode}` };
        if (path === "interfaces/IWETH.sol") return { contents: `${IWETHSourceCode}` };
        
        if (path === "libraries/UniswapV2Library.sol") return { contents: `${UniswapV2LibrarySourceCode}` };
        if (path === "libraries/UniswapV2LiquidityMathLibrary.sol") return { contents: `${UniswapV2LiquidityMathLibrarySourceCode}` };
        if (path === "libraries/UniswapV2OracleLibrary.sol") return { contents: `${UniswapV2OracleLibrarySourceCode}` };
        if (path === "libraries/SafeMath.sol") return { contents: `${SafeMathSourceCode}` };
        if (path === "SafeMath.sol") return { contents: `${SafeMathSourceCode}` };
        if (path === "UniswapV2Library.sol") return { contents: `${UniswapV2LibrarySourceCode}` };
        
        if (path === "IUniswapV2Router01.sol") return { contents: `${IUniswapV2Router01SourceCode}` };
        if (path === "UniswapV2Migrator.sol") return { contents: `${UniswapV2MigratorSourceCode}` };
        if (path === "UniswapV2Router01.sol") return { contents: `${UniswapV2Router01rSourceCode}` };
        if (path === "UniswapV2Router02.sol") return { contents: `${UniswapV2Router02rSourceCode}` };

        if(path === "@uniswap/lib/contracts/libraries/TransferHelper.sol") return { contents : `${TransferHelperSourceCode}` };
        if(path === "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol") return { contents : `${IUniswapV2FactorySourceCode}` };
        if(path === "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol") return { contents : `${IUniswapV2PairSourceCode}` };
        if(path === "@uniswap/lib/contracts/libraries/Babylonian.sol") return { contents : `${BabylonianSourceCode}` };
        if(path === "@uniswap/lib/contracts/libraries/FullMath.sol") return { contents : `${FullMathSourceCode}` };
        if(path === "@uniswap/lib/contracts/libraries/FixedPoint.sol") return { contents : `${FixedPointSourceCode}` };
        if(path === "@uniswap/lib/contracts/libraries/BitMath.sol") return { contents : `${BitMathSourceCode}` };

        return { error: "File not found" };
      }

    let output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    for(let contractName in output.contracts.Contract) {
        fs.outputJsonSync(
            path.resolve(buildPath, `${contractName}.json`),
            output.contracts.Contract[contractName]
        );
    }    
}

compileContract(["./", "UniswapV2Migrator.sol"]);
compileContract(["./", "UniswapV2Router01.sol"]);
compileContract(["./", "UniswapV2Router02.sol"]);

compileContract(["./", "libraries", "UniswapV2Library.sol"]);
compileContract(["./", "libraries", "SafeMath.sol"]);
compileContract(["./", "libraries", "UniswapV2LiquidityMathLibrary.sol"]);
compileContract(["./", "libraries", "UniswapV2OracleLibrary.sol"]); 

compileContract(["./", "interfaces", "V1", "IUniswapV1Exchange.sol"]);
compileContract(["./", "interfaces", "V1", "IUniswapV1Factory.sol"]);
compileContract(["./", "interfaces", "IERC20.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Migrator.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Router01.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Router02.sol"]);
compileContract(["./", "interfaces", "IWETH.sol"]);

compileContract(["./", "test", "ERC20.sol"]);
compileContract(["./", "test", "DeflatingERC20.sol"]);
compileContract(["./", "test", "WETH9.sol"]);
compileContract(["./", "test", "RouterEventEmitter.sol"]);