const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Comments", function () {
  it("Should add and fetch comments successfully", async function () {
    const CommentsContractFacotry = await ethers.getContractFactory("Comments");
    const commentsContract = await CommentsContractFacotry.deploy();
    await commentsContract.deployed();
    
    expect(await commentsContract.getComments("my-first-blog-post")).to.be.lengthOf(0);

    const tx1 = await commentsContract.addComment(
      "my-first-blog-post",
      "my first comment"
    );
    await tx1.wait();

    expect(await commentsContract.getComments("my-first-blog-post")).to.be.lengthOf(1);
    expect(await commentsContract.getComments("my-second-blog-post")).to.be.lengthOf(0);

    const tx2 = await commentsContract.addComment(
      "my-second-blog-post",
      "this comment is on a different thread"
    );
    await tx2.wait();

    expect(await commentsContract.getComments("my-first-blog-post")).to.be.lengthOf(1);
    expect(await commentsContract.getComments("my-second-blog-post")).to.be.lengthOf(1);
  });
});