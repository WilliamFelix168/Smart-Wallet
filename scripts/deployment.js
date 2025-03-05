const {
    ethers
} = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Owner : " + owner.address);

    const ACFactory = await ethers.getContractFactory('AC', owner);
    const AC = await ACFactory.deploy();
    const ACTokenAddress = await AC.getAddress();
    console.log("AC Token Address : ", ACTokenAddress);

    const WalletFactory = await ethers.getContractFactory('SmartWallet', owner);
    const Wallet = await WalletFactory.deploy();
    const WalletAddress = await Wallet.getAddress();
    console.log("Wallet Address : ", WalletAddress);

    await AC.connect(owner).mint(
        owner.address,
        ethers.parseEther('1000') //10000 0000000000000000000000000000000 (dalam 18x / dalam unit terkecil)
    )

    console.log("Owner's AC Token Balance", ethers.formatEther(await AC.balanceOf(owner.address)));

    await AC.connect(owner).transfer(
        WalletAddress,
        ethers.parseEther('100')
    )
    console.log("Transfered 100 $AC to smart wallet ..!");
    console.log("Owner's AC Token Balance", ethers.formatEther(await AC.balanceOf(owner.address)));
    console.log("Smart Wallet's AC Token Balance", ethers.formatEther(await AC.balanceOf(WalletAddress)));

    console.log("Test getTokenBalance", await Wallet.getTokenBalance(ACTokenAddress));

    console.log();

    await Wallet.withdrawToOwner(ACTokenAddress, ethers.parseEther('50'))

    console.log("Withdraw 50 $AC ...");

    console.log("Owner's AC Token Balance", ethers.formatEther(await AC.balanceOf(owner.address)));
    console.log("Smart Wallet's AC Token Balance", ethers.formatEther(await AC.balanceOf(WalletAddress)));

    const sendEth = await owner.sendTransaction({
        to: WalletAddress,
        value: ethers.parseEther("1")
    })

    console.log("\n Send 1 ETH from Owner to Smart Wallet... !");

    console.log("Tx hash: ", sendEth.hash);

    console.log("Smart Wallet ETH Balance", ethers.formatEther(await Wallet.getETHBalance()));

    console.log("Owner's ETH Balance : ", ethers.formatEther(await ethers.provider.getBalance(owner.address)))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });