const { ethers } = require("ethers")
const getSigner = require("./getSigner")
const { tokenAbi, tokenContractAddresses } = require("./constants")

const getTokenContract = (_chainId) => {
    const tokenAddress =
        _chainId in tokenContractAddresses
            ? tokenContractAddresses[_chainId][0]
            : null
    const { wallet } = getSigner(_chainId)
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)
    return tokenContract
}

module.exports = getTokenContract
