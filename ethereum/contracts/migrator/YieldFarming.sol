pragma solidity =0.6.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./tokens/IUniswapV2Pair.sol";
import "./tokens/BonusToken.sol";

contract YieldFarming {

    using SafeMath for uint256;
    
    IUniswapV2Pair public pairFork;
    BonusToken public bonusToken;
    address public admin;
    mapping(address => uint256) public depositedAmount;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public rewards;

    constructor(address _pairFork, address _bonusToken) public {
        pairFork = IUniswapV2Pair(_pairFork);
        bonusToken = BonusToken(_bonusToken);
        admin = msg.sender;
    }

    function stake(uint256 _amount) external {

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            rewards[msg.sender] == 0 ? rewards[msg.sender] = toTransfer : rewards[msg.sender].add(rewards[msg.sender]);
        }

        pairFork.transferFrom(msg.sender, address(this), _amount);
        depositedAmount[msg.sender] == 0 ? depositedAmount[msg.sender] = _amount : depositedAmount[msg.sender].add(_amount);
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
    }

    function unstake(uint256 _amount) external {
        require(depositedAmount[msg.sender] != 0, "Nothing to unstake ...");
        require(_amount <= depositedAmount[msg.sender], "Withdraw amount to high!");
        pairFork.transfer(msg.sender, _amount);
        uint256 balanceTransfer = _amount;
        _amount = 0;
        depositedAmount[msg.sender].sub(balanceTransfer);
        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp; 
        depositedAmount[msg.sender].sub(balanceTransfer);
        rewards[msg.sender].add(yieldTransfer);
        if(depositedAmount[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
    }

    function withdrawRewards() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            rewards[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(rewards[msg.sender] != 0){
            uint256 oldBalance = rewards[msg.sender];
            rewards[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        bonusToken.mint(msg.sender, toTransfer);
    }

    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end.sub(startTime[user]);
        return totalTime;
    }

    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user).mul(10**18);
        uint256 rate = 86400;
        uint256 timeRate = time.div(rate);
        uint256 rawYield = (depositedAmount[user].mul(timeRate)).div(10**18);
        return rawYield;
    } 
}