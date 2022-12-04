import React from 'react'

export function AbbreviateNumbers() {
    // 1000 => Output: 1K, Input: 1234000 => Output: 1.22M, Input: 100, Output: 100, Input: 1000000, Output: 1M, Input: 16555000, Output: 16.66M
    let units = {K: 1000, M: 1000000, B: 1000000000}
    let test = (1234000 / units.M).toFixed(2);
    let check = test.split(".")
    // console.log(1234000 % units.M)
    return (
    <div>
        AbbreviateNumbers : {Math.floor(check[1])} :::: {1234000 / units.M} : {(1234000 / units.M).toFixed(2)} : {Math.round((1234000 / units.M).toFixed(2))} : {Math.round((1234000 / units.M).toFixed(2) * 100) / 100} : {Math.floor((1234000 / units.M).toFixed(2))}
        {convertNumbersIntoAbbreviations(1234000)}
        {convertNumbersIntoAbbreviations(16555000)}
    </div>
  )
}

let convertNumbersIntoAbbreviations = num => {
    let units = {K: 1000, M: 1000000, B: 1000000000}
    let str = "";
    
    let temp = null;

    if(num < units.K) {
        str = num;
    } else if (num === units.K) {
        str = "1K"
    } else if(num > units.K && num < units.M) {
        temp = (num / units.K).toFixed(2)
        str = temp + "K"
    } else if (num === units.M) {
        str = "1M"
    } else if(num > units.M && num < units.B) {
        temp = (num / units.M).toFixed(2)
        str = temp + "M"
    } else if (num === units.B) {
        str = "1B"
    } else if(num > units.B ) {
        temp = (num / units.B).toFixed(2)
        str = temp + "B"
    }

    return str;
}