import { ethers } from "hardhat";

async function main() {
  const initialOwner = "0xbf4EE65FE67C291DfC34ffe2455ecA9d97DF9148";

  const ZBFactory = await ethers.getContractFactory("ZB");
  const ZB = await ZBFactory.deploy(initialOwner);
  await ZB.waitForDeployment();

  const SaveERC20Factory = await ethers.getContractFactory("SaveERC20");
  const SaveERC20 = await SaveERC20Factory.deploy(ZB.target);
  await SaveERC20.waitForDeployment();

  console.log("ZB deployed to:", ZB.target);
  console.log("SaveERC20 deployed to:", SaveERC20.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
