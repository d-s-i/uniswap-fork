"use-strict";

const path = require("path");
const solc = require("solc"); //don"t forget to install the right solc version ! (0.6.6 for periphery)
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
        if(path[0] === "@") { // directly into node_ module
            const sourceCodeToImport = fs.readFileSync(`../../../node_modules/${path}`);
            return { contents: `${sourceCodeToImport}` };
        } 
        if(path.includes("periphery")) {
            const sourceCodeToImport = fs.readFileSync(`../${path}`);
            return { contents: `${sourceCodeToImport}` };
        }
        if (arrayContractPath.length === 2) { // array contract path is "./" + contract.sol, i.e the compield contract is in the same folder as compile.js => import paths have the same starting point, no need to change them
            const sourceCodeToImport = fs.readFileSync(`./${path}`);
            return { contents: `${sourceCodeToImport}` };
        }
        if(!path.includes("/")) { // === contract to import is in the same folder as the contract we are compiling i.e the import path from the contract fiel doesn't include "/"
            const sourceCodeToImport = fs.readFileSync(`./${intermediateFoldersOfCurrentContract.join("/")}/${path}`);
            return { contents: `${sourceCodeToImport}` };
        }
        else { // if neither of these, contract must be (in my case) accessible from outside the compile.js
            const sourceCodeToImport = fs.readFileSync(`../${path}`);
            return { contents: `${sourceCodeToImport}` }
        }
      }

    let output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    console.log(output);

    for(let contractName in output.contracts.Contract) {
        fs.outputJsonSync(
            path.resolve(buildPath, `${contractName}.json`),
            output.contracts.Contract[contractName]
        );
    }    
}

compileContract(["./", "YieldFarmingBabyLeash.sol"]);
compileContract(["./", "YieldFarmingBabyDoge.sol"]);
