// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const VestingManager = await hre.ethers.getContractFactory("VestingManager");
  const vestingManager = await VestingManager.deploy();
  console.log("running");
  await vestingManager.deployed();
  console.log("Contract deployed to:", vestingManager.address);
  // const [owner, otherAccount,onemore] = await ethers.getSigners();
  // // console.log(onemore.address,otherAccount.address);
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");
  // const benefeciaries = [owner.address,otherAccount.address]
  // const VestingManager = await hre.ethers.getContractFactory("VestingManager");
  // const vestingManager = await VestingManager.deploy();

  // await vestingManager.deployed();

  // await vestingManager.vest(benefeciaries);

  // const vestingIds = await vestingManager.vestingIds()
  // console.log(vestingIds);
  // const userVestingIds = await vestingManager.userVestingIds(owner.address)
  // console.log(userVestingIds);

  // const Vesting = await hre.ethers.getContractFactory("Vesting");
  // const vesting =  Vesting.attach(vestingIds[0]);
  // console.log(await vesting.totalAllocation());
  // console.log(await token.totalSupply());


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
