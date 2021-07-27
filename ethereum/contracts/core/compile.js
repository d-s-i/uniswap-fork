"use-strict";

const path = require("path");
const solc = require("solc"); //don"t forget to install the right solc version ! (here 0.5.16)
const fs = require("fs-extra");

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
        const importSourceCode = fs.readFileSync(`./${path}`);
        return { contents: `${importSourceCode}` }
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