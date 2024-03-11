const { time, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
import { expect } from "chai";
import { ethers } from "hardhat";
import { SaveERC20, ZB } from "../typechain-types";

describe("SaveERC20", function () {
  let zb: ZB;
  let saveERC20: SaveERC20;
  let owner: any;

  before(async function () {
    const accounts = await ethers.getSigners();
    owner = accounts[0];

    const ZBFactory = await ethers.getContractFactory("ZB");
    zb = await ZBFactory.deploy(owner.address);

    const SaveERC20Factory = await ethers.getContractFactory("SaveERC20");
    saveERC20 = await SaveERC20Factory.deploy(zb.target);
  });

  it("SaveERC20", async function () {
    const ownerBal = await zb.connect(owner).balanceOf(owner.address);
    expect(BigInt(ownerBal)).to.equal(BigInt(100000000000000000000));

    const initialOwnerBal = await saveERC20.connect(owner).checkUserBalance(owner.address);
    expect(initialOwnerBal).to.equal(0);

    const spender = saveERC20.target;
    await zb.connect(owner).approve(spender, 100);
    expect(await zb.connect(owner).allowance(owner.address, spender)).to.equal(100);

    await saveERC20.connect(owner).deposit(50);
    expect(await saveERC20.checkUserBalance(owner.address)).to.equal(50);

    await saveERC20.connect(owner).withdraw(30);
    expect(await saveERC20.checkUserBalance(owner.address)).to.equal(20);

    const contractBal = await saveERC20.connect(owner).checkContractBalance();
    expect(contractBal).to.equal(20);

    await saveERC20.connect(owner).ownerWithdraw(20);
    expect(await saveERC20.checkUserBalance(owner.address)).to.equal(20);

    console.log(await saveERC20.connect(owner).checkUserBalance(owner.address));
  });
});
