"use-strict";

const path = require("path");
const solc = require("solc"); //don"t forget to install the right solc version !
const fs = require("fs-extra");

// test folder
const ERC20SourceCode = fs.readFileSync("./test/ERC20.sol");

// interfaces folder
const IERC20SourceCode = fs.readFileSync("./interfaces/IERC20.sol");
const IUniswapV2CalleeSourceCode = fs.readFileSync("./interfaces/IUniswapV2Callee.sol");
const IUniswapV2ERC20SourceCode = fs.readFileSync("./interfaces/IUniswapV2ERC20.sol");
const IUniswapV2FactorySourceCode = fs.readFileSync("./interfaces/IUniswapV2Factory.sol");
const IUniswapV2PairSourceCode = fs.readFileSync("./interfaces/IUniswapV2Pair.sol");

// libraries folder
const MathSourceCode = fs.readFileSync("./libraries/Math.sol");
const UQ112x112SourceCode = fs.readFileSync("./libraries/UQ112x112.sol");
const SafeMathSourceCode = fs.readFileSync("./libraries/SafeMath.sol");

// core folder
const UniswapV2PairSourceCode = fs.readFileSync("./UniswapV2Pair.sol");
const UniswapV2ERC20SourceCode = fs.readFileSync("./UniswapV2ERC20.sol");
const UniswapV2FactorySourceCode = fs.readFileSync("./UniswapV2Factory.sol");

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
        if (path === "interfaces/IUniswapV2Factory.sol") return { contents: `${IUniswapV2FactorySourceCode}` };
        if (path === "interfaces/IERC20.sol") return { contents: `${IERC20SourceCode}` };
        if (path === "interfaces/IUniswapV2Callee.sol") return { contents: `${IUniswapV2CalleeSourceCode}` };
        if (path === "interfaces/IUniswapV2ERC20.sol") return { contents: `${IUniswapV2ERC20SourceCode}` };
        if (path === "interfaces/IUniswapV2Pair.sol") return { contents: `${IUniswapV2PairSourceCode}` };
        if (path === "libraries/Math.sol") return { contents: `${MathSourceCode}` };
        if (path === "libraries/UQ112x112.sol") return { contents: `${UQ112x112SourceCode}` };
        if (path === "libraries/SafeMath.sol") return { contents: `${SafeMathSourceCode}` };
        if (path === "UniswapV2Pair.sol") return { contents: `${UniswapV2PairSourceCode}` };
        if (path === "UniswapV2ERC20.sol") return { contents: `${UniswapV2ERC20SourceCode}` };
        if (path === "UniswapV2Factory.sol") return { contents: `${UniswapV2FactorySourceCode}` };
        else return { error: "File not found" };
      }

    let output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    for(let contractName in output.contracts.Contract) {
        fs.outputJsonSync(
            path.resolve(buildPath, `${contractName}.json`),
            output.contracts.Contract[contractName]
        );
    }    
}

compileContract(["./", "UniswapV2Factory.sol"]);
compileContract(["./", "UniswapV2Pair.sol"]);
compileContract(["./", "UniswapV2ERC20.sol"]);
compileContract(["./", "libraries", "Math.sol"]);
compileContract(["./", "libraries", "SafeMath.sol"]);
compileContract(["./", "libraries", "UQ112x112.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Factory.sol"]);
compileContract(["./", "interfaces", "IERC20.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Callee.sol"]);
compileContract(["./", "interfaces", "IUniswapV2ERC20.sol"]);
compileContract(["./", "interfaces", "IUniswapV2Pair.sol"]);
compileContract(["./", "test", "ERC20.sol"]);