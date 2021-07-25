const path = require("path");
const solc = require("solc"); //don't forget to install the right solc version !
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

function compileContract(Contract) {
    const contractPath = path.resolve(__dirname, "./", Contract);  
    
    const contractSourceCode = fs.readFileSync(contractPath, "utf8");
    
    fs.ensureDirSync(buildPath);

    var input = {
        language: 'Solidity',
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
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    };

    let output = JSON.parse(solc.compile(JSON.stringify(input)));
    // console.log(output.errors[0].sourceLocation);
    console.log(output);

    // for(let contractName in output.contracts.Contract) {
    //     fs.outputJsonSync(
    //         path.resolve(buildPath, `${contractName}.json`),
    //         output.contracts.Contract[contractName]
    //     );
    // }    
}

compileContract("UniswapV2Router02.sol");
// compileContract("UniswapV2Pair.sol");
// compileContract("UniswapV2ERC20.sol");