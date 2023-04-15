// imports
const { ethers, run, network } = require("hardhat");
require("dotenv").config();

// functions
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage"); // get contract
  console.log("Deploying contract...");

  const simpleStorage = await SimpleStorageFactory.deploy(); // deploy contract
  await simpleStorage.deployed(); // wait for contract deployment
  console.log(`Deployed contract to: ${simpleStorage.address}`);

  // if it is not a local network (if it's in sepolia)
  if (network.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes...");
    // await simpleStorage.deployTransaction.wait(6); // wait 6 blocks

    await verify(simpleStorage.address, []); // verify contract
  }

  // interacting with the contract
  const currentValue = await simpleStorage.retrieve(); // Get current value
  console.log(`Current value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7); // update current value
  await transactionResponse.wait(1); // wait 1 block
  const updatedValue = await simpleStorage.retrieve(); // get updated value
  console.log(`Updated value is: ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
