pragma solidity =0.6.6;

import "./tokens/IUniswapV2Pair.sol";
import "../periphery/test/BabyLeash.sol";

contract YieldFarmingBabyDoge {

    using SafeMath for uint256;
    
    IUniswapV2Pair public pairFork;
    BabyLeash public babyLeash;
    address public admin;
    mapping(address => uint256) public depositedAmount;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public rewards;

    constructor(address _pairFork, address _babyLeash) public {
        pairFork = IUniswapV2Pair(_pairFork);
        babyLeash = BabyLeash(_babyLeash);
        admin = msg.sender;
    }

    function stake(uint256 _amount) external {

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            rewards[msg.sender] == 0 ? rewards[msg.sender] = toTransfer : rewards[msg.sender].add(toTransfer);
        }

        pairFork.transferFrom(msg.sender, address(this), _amount);
        depositedAmount[msg.sender] == 0 ? depositedAmount[msg.sender] = _amount : depositedAmount[msg.sender].add(_amount);
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
    }

    function unstake(uint256 _amount) external {
        require(depositedAmount[msg.sender] != 0, "Nothing to unstake ...");
        require(_amount <= depositedAmount[msg.sender], "Withdraw amount too high!");
        uint256 balanceTransfer = _amount;
        _amount = 0;
        withdrawRewards();
        pairFork.transfer(msg.sender, balanceTransfer);
        depositedAmount[msg.sender] = depositedAmount[msg.sender].sub(balanceTransfer);
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
            toTransfer = toTransfer.add(oldBalance);
        }

        startTime[msg.sender] = block.timestamp;
        babyLeash.mint(msg.sender, toTransfer);
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