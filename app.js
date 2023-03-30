require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { ethers } = require("ethers")
const calculateDripAmount = require("./utils/calculateDripAmount")
const getTokenContract = require("./utils/getTokenContract")
const getSigner = require("./utils/getSigner")
const isAllowedToWithdraw = require("./utils/isAllowedToWithdraw")
const fetchLogs = require("./utils/getTransferEvents")

const PORT = process.env.PORT || 3333
const app = express()
app.use(cors({ origin: "*", credentials: true, optionSuccessStatus: 200 }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    try {
        res.status(200).send(
            '<h1>Hello! This API site is under construction</h1><a href="/api/">Go to api</a>'
        )
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }
})

app.get("/v1/api/faucets", async (req, res) => {
    try {
        const { wallet: walletMumbai } = getSigner(80001)
        const { wallet: walletSepolia } = getSigner(11155111)
        const tokenContractSepolia = getTokenContract(80001)
        const tokenContractMumbai = getTokenContract(11155111)
        const faucetBalanceSepolia = await tokenContractSepolia.balanceOf(
            walletSepolia.address
        )
        const faucetBalanceMumbai = await tokenContractMumbai.balanceOf(
            walletMumbai.address
        )
        const sepoliaFaucetDripAmount =
            calculateDripAmount(faucetBalanceSepolia)
        const mumbaiFaucetDripAmount = calculateDripAmount(faucetBalanceMumbai)

        res.status(200).json({
            balanceSepolia: ethers.formatEther(faucetBalanceSepolia),
            balanceMumbai: ethers.formatEther(faucetBalanceMumbai),
            sepoliaFaucetDripAmount,
            mumbaiFaucetDripAmount,
        })
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }
})

app.get("/v1/api/transactions/:chainId", async (req, res) => {
    const { chainId } = req.params

    try {
        const { logsData, feeData } = await fetchLogs(chainId)
        res.status(200).json({
            logsData,
            feeData,
        })
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }
})

app.post("/v1/api/request", async (req, res) => {
    try {
        res.writeHead(201, { "content-type": "application/json" })

        const { chainId, address } = req.body
        const regex = /[0-9A-Fa-f]{6}/g

        if (address.match(regex)) {
            const tokenContract = getTokenContract(chainId)
            const { wallet } = getSigner(chainId)
            const faucetBalance = await tokenContract.balanceOf(wallet.address)
            const dripAmount = calculateDripAmount(faucetBalance)
            const canWithdraw = isAllowedToWithdraw(
                chainId,
                address,
                dripAmount,
                res
            )

            if (Number(dripAmount) > 0 && canWithdraw) {
                const transactionResponse = await tokenContract.transfer(
                    address,
                    ethers.parseEther(dripAmount),
                    {
                        gasLimit: 100000,
                    }
                )

                res.write(
                    JSON.stringify({
                        transactionResponse: transactionResponse,
                        success: true,
                    })
                )

                res.end()
            }
        } else {
            res.write(
                JSON.stringify({
                    message: "Please insert a valid address.",
                })
            )
            res.end()
        }
    } catch (e) {
        const error = e.toString()
        res.status(400).json({ error })
    }
})

app.all("*", (req, res) => {
    res.status(404).send("Sorry, this resource doesn't exist!")
})

app.listen(PORT, () => console.log(`The sever is running on port ${PORT}`))
