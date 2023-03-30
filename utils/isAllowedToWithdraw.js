const { readFileSync, writeFileSync } = require("fs")

const isAllowedToWithdraw = (_chainId, _account, _dripAmount, _res) => {
    const path = `./utils/requestors/requestors${
        _chainId === 80001
            ? "Mumbai"
            : _chainId === 31337
            ? "Hardhat"
            : "Sepolia"
    }.json`

    const timestamp = Math.floor(Date.now() / 1000)

    try {
        const requestors = JSON.parse(readFileSync(path, "utf8"))

        // Checks if the `accounts` exists in the database.
        // If the `account` is in the database and enough time has elapsed since the last request,
        // then, the data of the account is updated and `true` is return.
        if (_account in requestors) {
            if (timestamp >= requestors[_account]["timestamp"]) {
                requestors[_account]["timestamp"] =
                    Math.floor(Date.now() / 1000) + 600
                requestors[_account]["totalRequested"] =
                    requestors[_account]["totalRequested"] + Number(_dripAmount)
                requestors[_account]["requests"] =
                    requestors[_account]["requests"] + 1

                writeFileSync(path, JSON.stringify(requestors))
                return true

                // If not enough time has elapsed, return false and notifies the UI.
            } else {
                _res.write(
                    JSON.stringify({
                        message:
                            "Not enough time has passed since your last request.",
                    })
                )
                _res.end()
                return false
            }

            // If the `account` wasn't in the database it's added and returns `true`.
        } else {
            requestors[_account] = {
                timestamp: Math.floor(Date.now() / 1000) + 600,
                totalRequested: Number(_dripAmount),
                requests: 1,
            }
            writeFileSync(path, JSON.stringify(requestors))
            return true
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = isAllowedToWithdraw
