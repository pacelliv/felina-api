require("dotenv").config()

const chainConfig = {
    11155111: {
        name: "Sepolia",
        network: "sepolia",
        nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "ETH",
            decimals: 18,
        },
        testnet: true,
        rpcUrl: process.env.SEPOLIA_RPC_URL,
        explorer: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io",
            api: "https://api-sepolia.etherscan.io/api",
        },
    },
    80001: {
        name: "Polygon Mumbai",
        network: "maticmum",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        testnet: true,
        rpcUrl: process.env.MUMBAI_RPC_URL,
        explorer: {
            name: "PolygonScan",
            url: "https://mumbai.polygonscan.com",
            api: "https://api-testnet.polygonscan.com/api",
        },
    },
    31337: {
        name: "Hardhat",
        network: "hardhat",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
        testnet: false,
        rpcUrl: "http://127.0.0.1:8545/",
    },
}

module.exports = { chainConfig }
