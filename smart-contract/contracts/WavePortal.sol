// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // state variable, permanently stored on the blockchain
    uint256 totalWaves;
    uint256 private seed;

    // create a log
    event newWave(address indexed from, uint256 timestamp, string message);

    constructor () payable {
        console.log("Constructor constructed");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    struct Wave {
        // address of the user who waved
        address waver;
        // messager the user sent
        string message;
        // timestamp when user waved
        uint256 timestamp;
    }
    Wave[] waves;

    mapping(address => uint256) public visitorWaveCount;
    mapping(address => uint256) public lastWavedAt;

    function wave(string memory _message) public {
        require(lastWavedAt[msg.sender] + 15 seconds < block.timestamp, "Wait 15m");
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        visitorWaveCount[msg.sender]++;
        console.log("%s has waved", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 30) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.00015 ether;
            require (
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract");
        }

        // save log to blockchain
        emit newWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns(Wave[] memory) {
        return waves;
    }

    function getSenderTotalWaves(address sender) public view returns(uint256) {
        return visitorWaveCount[sender];
    }


    function getTotalWaves() public view returns(uint256) {
        return totalWaves;
    }
}