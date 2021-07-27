"use-strict";

const path = require("path");
const solc = require("solc"); //don"t forget to install the right solc version !
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

function compileContract(arrayContractPath) {
    const contractPath = path.resolve(__dirname, ...arrayContractPath);
    
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

    const intermediateFoldersOfCurrentContract = arrayContractPath.slice(1, -1);

    function findImports(path) {
        let sourceCodeToImport;
        if(path[0] === "@") { // directly into node_ module
            sourceCodeToImport = fs.readFileSync(`../../../node_modules/${path}`);
            return { contents: `${sourceCodeToImport}` };
        } 
        if (arrayContractPath.length === 2) { // array contract path is "./" + contract.sol, i.e simple import in the same folder as the compile.js
            sourceCodeToImport = fs.readFileSync(`./${path}`);
            return { contents: `${sourceCodeToImport}` };
        }
        if(!path.includes("/")) { // === contract to import is in the same folder as the contract we are compiling i.e the import path from the contract fiel doesn't include "/"
            sourceCodeToImport = fs.readFileSync(`./${intermediateFoldersOfCurrentContract}/${path}`);
            return { contents: `${sourceCodeToImport}` };
        }
        else { // if neither of these, contract must be (in my case) accessible from the compile.js, i.e no need to change the path
            sourceCodeToImport = fs.readFileSync(`./${path}`);
            return { contents: `${sourceCodeToImport}` }
        }
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