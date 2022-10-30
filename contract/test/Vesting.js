const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("Vesting", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVesting() {
    const [owner, account1,account2,account3,account4,account5,account6,account7,account8,account9,account10,account11,account12,account13] = await ethers.getSigners();
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;
  
    const benefeciaries = [account1.address,account2.address,account3.address,account4.address,account5.address,account6.address,account7.address,account8.address,account9.address,account10.address,account11.address,account12.address]   
    const Vesting = await hre.ethers.getContractFactory("Vesting");
    const vesting = await Vesting.deploy(benefeciaries);
  
    await vesting.deployed();

    const XYZToken = await hre.ethers.getContractFactory("XYZToken");
    const tokenAddress = await vesting.token()
    const token =  XYZToken.attach(tokenAddress);

    return { Vesting,vesting,token, unlockTime, owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10,account11,account12,account13,benefeciaries };
  }

  describe("Deployment", function () {
    it("Should not deploy wihtout beneficiaries", async function () {
      const { Vesting,benefeciaries } = await loadFixture(deployVesting);

      await expect(Vesting.deploy([])).to.be.revertedWith(
        "There must be atleast one beneficiary."
      );
    });

    it("Should not deploy with 0 address beneficiaries", async function () {
      const { Vesting } = await loadFixture(deployVesting);

      await expect(Vesting.deploy(["0x0000000000000000000000000000000000000000"])).to.be.revertedWith(
        "Beneficiary address cannot be zero."
      );
    });

    it("Should not deploy with repeated beneficiaries", async function () {
      const { Vesting ,account1} = await loadFixture(deployVesting);

      await expect(Vesting.deploy([account1.address,account1.address])).to.be.revertedWith(
        "Same account cannot be added twice."
      );
    });

    it("Should not deploy with more than 12 beneficiaries", async function () {
      const { Vesting,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10,account11,account12,account13 } = await loadFixture(deployVesting);
      const benefeciaries = [account1.address,account2.address,account3.address,account4.address,account5.address,account6.address,account7.address,account8.address,account9.address,account10.address,account11.address,account12.address,account13.address]
      await expect(Vesting.deploy(benefeciaries)).to.be.revertedWith(
        "There can be maximum 12 beneficiaries."
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Release", function () {
      it("Should release the right amount after a min", async function () {
        const { vesting } = await loadFixture(deployVesting);
        const startTime = await vesting.start();      
        //increase time by one min
        await time.increaseTo(startTime.toNumber() + 60);

        await expect(vesting.release()).not.to.be.reverted
      });


      it("Should transfer tokens to benefeciaries on release", async function () {
        const { vesting, token,account1} = await loadFixture(
          deployVesting
        );

        const startTime = await vesting.start();      
        //increase time by one min
        await time.increaseTo(startTime.toNumber() + 60);
        
        //calculate amount to be transfered
        const totalAllocation = await vesting.totalAllocation();
        const duration = await vesting.duration();
        

        // calculate release amount after 1 minute for 12 benefeciaries
        const amount = (totalAllocation.div(duration)).mul(60).div(12) // amount for one min

        await expect(vesting.release()).to.changeTokenBalance(token, account1, amount);//180 tokens released in a min
      });
    });

    describe("Events", function () {
      it("Should emit an event on Release", async function () {
        const { vesting,token} = await loadFixture(
          deployVesting
        );

        const startTime = await vesting.start();      
        //increase time by one min
        await time.increaseTo(startTime.toNumber() + 60);
  
        //calculate amount to be transfered
        const totalAllocation = await vesting.totalAllocation();
        const duration = await vesting.duration();
        

        // calculate release amount after 1 minute for 12 benefeciaries
        const amount = (totalAllocation.div(duration)).mul(60).div(12) // amount for one min

        await expect(vesting.release())
          .to.emit(vesting, "ERC20Released")
          .withArgs(token.address, amount); 
      });
    });

  
  });
});
