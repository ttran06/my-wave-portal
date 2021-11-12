const { hexStripZeros } = require("@ethersproject/bytes")

const main = async () => {
    // compile contract
    // hre: Hardhat runtime Environment
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    // deploy contract, create a new local blockchain everytime the contract is run
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    // wait for contract to finish mining
    await waveContract.deployed();
    console.log('Contract addy: ', waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    let waveTxn = await waveContract.wave('Hi!!');
    await waveTxn.wait(); // wait for transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

    const[_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave('Another hi');
    await waveTxn.wait();

    waveTxn = await waveContract.connect(randomPerson).wave('third hi');
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log("%d total waves 🤯", waveCount.toNumber());
    visitorCount = await waveContract.getSenderTotalWaves(randomPerson.address);
    console.log('Address ', randomPerson.address, 'wave count: ', visitorCount.toNumber())

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();