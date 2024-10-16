// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PredictionMarket {
    address public owner;
    string public question;
    uint256 public endTime;
    bool public resolved;
    bool public outcome;

    uint256 public totalYesVotes;
    uint256 public totalNoVotes;

    mapping(address => uint256) public yesVotes;
    mapping(address => uint256) public noVotes;

    event Voted(address indexed voter, bool vote, uint256 amount);
    event MarketResolved(bool outcome);

    constructor(string memory _question, uint256 _duration) {
        owner = msg.sender;
        question = _question;
        endTime = block.timestamp + _duration;
    }

    function voteYes() public payable {
        require(block.timestamp < endTime, "Voting has ended");
        require(msg.value > 0, "Must send some ETH to vote");
        yesVotes[msg.sender] += msg.value;
        totalYesVotes += msg.value;
        emit Voted(msg.sender, true, msg.value);
    }

    function voteNo() public payable {
        require(block.timestamp < endTime, "Voting has ended");
        require(msg.value > 0, "Must send some ETH to vote");
        noVotes[msg.sender] += msg.value;
        totalNoVotes += msg.value;
        emit Voted(msg.sender, false, msg.value);
    }

    function resolveMarket(bool _outcome) public {
        require(msg.sender == owner, "Only owner can resolve");
        require(block.timestamp >= endTime, "Voting period not over");
        require(!resolved, "Already resolved");
        resolved = true;
        outcome = _outcome;
        emit MarketResolved(_outcome);
    }

    function claim() public {
        require(resolved, "Market not resolved yet");
        uint256 payout = 0;
        if (outcome && yesVotes[msg.sender] > 0) {
            payout = (yesVotes[msg.sender] * (totalYesVotes + totalNoVotes)) / totalYesVotes;
            yesVotes[msg.sender] = 0;
        } else if (!outcome && noVotes[msg.sender] > 0) {
            payout = (noVotes[msg.sender] * (totalYesVotes + totalNoVotes)) / totalNoVotes;
            noVotes[msg.sender] = 0;
        }
        if (payout > 0) {
            payable(msg.sender).transfer(payout);
        }
    }

    function getVotePercentages() public view returns (uint256 yesPercentage, uint256 noPercentage) {
        uint256 total = totalYesVotes + totalNoVotes;
        if (total == 0) {
            return (0, 0);
        }
        yesPercentage = (totalYesVotes * 100) / total;
        noPercentage = 100 - yesPercentage;
    }
}