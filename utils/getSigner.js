const { ethers } = require("ethers")
const { chainConfig } = require("./chainConfig")
require("dotenv").config()

const getSigner = (_chainId) => {
    const rpcUrl = chainConfig[Number(_chainId)]["rpcUrl"]
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(
        _chainId === 31337
            ? process.env.PRIVATE_KEY_HARDHAT_ZERO
            : process.env.PRIVATE_KEY_B,
        provider
    )
    return { wallet, provider }
}

module.exports = getSigner
