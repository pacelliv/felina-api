const { ethers } = require("ethers")
const { chainConfig } = require("./chainConfig")
const { tokenAbi } = require("../utils/constants")
const getTokenContract = require("./getTokenContract")
require("dotenv").config()

const getFormattedLogData = (data) => {
    const formattedData = []

    data.forEach((data) => {
        formattedData.unshift({
            transactionHash: data.transactionHash,
            blockNumber: data.blockNumber,
            _from: data.args[0],
            _to: data.args[1],
            _value: ethers.formatEther(data.args[2].toString()),
        })
    })

    return formattedData
}

const mergeLogsData = (logs, parsedLogs) => {
    const arrayData = []
    for (let i = 0; i < logs.length; i++) {
        arrayData.push({
            ...logs[i],
            ...parsedLogs[i],
        })
    }

    return getFormattedLogData(arrayData)
}

const fetchLogs = async (_chainId) => {
    const rpcUrl = chainConfig[Number(_chainId)]["rpcUrl"]
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const tokenContract = getTokenContract(_chainId)
    const currentBlock = await provider.getBlockNumber()
    const filter = {
        address: tokenContract.target,
        topics: [ethers.id("Transfer(address,address,uint256)")],
        fromBlock: currentBlock - 1000000,
        toBlock: currentBlock,
    }

    const iface = ethers.Interface.from(tokenAbi)
    const transferLogs = await provider.getLogs(filter)
    const parsedTransferLogs = transferLogs.map((log) => iface.parseLog(log))
    const feeData = await provider.getFeeData()
    const logsData = mergeLogsData(transferLogs, parsedTransferLogs)

    return {
        logsData,
        feeData,
    }
}

module.exports = fetchLogs
