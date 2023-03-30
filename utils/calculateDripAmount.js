function calculateDripAmount(_balance) {
    let dripAmount

    if (Number(_balance) > 50000) {
        dripAmount = "10"
    } else if (Number(_balance) > 35000 && Number(_balance) <= 50000) {
        dripAmount = "8"
    } else if (Number(_balance) > 15000 && Number(_balance) <= 35000) {
        dripAmount = "5"
    } else if (Number(_balance) > 2500 && Number(_balance) <= 15000) {
        dripAmount = "2"
    } else {
        dripAmount = "0"
    }

    return dripAmount
}

module.exports = calculateDripAmount
