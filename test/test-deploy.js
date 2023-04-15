const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SimpleStorage", () => {
  let SimpleStorageFactory;
  let simpleStorage;
  beforeEach(async () => {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorageFactory.deploy();
  });
  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal("0");
  });
  it("Should update when we call store", async () => {
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal("7");
  });
});
