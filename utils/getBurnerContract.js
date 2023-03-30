const { ethers } = require("ethers")
const getSigner = require("./getSigner")
const { burnerAbi, burnerContractAddresses } = require("./constants")

const getBurnerContract = (_chainId) => {
    const burnerAddress =
        _chainId in burnerContractAddresses
            ? burnerContractAddresses[_chainId][0]
            : null
    const { wallet } = getSigner(_chainId)
    const burnerContract = new ethers.Contract(burnerAddress, burnerAbi, wallet)
    return burnerContract
}

module.exports = getBurnerContract
