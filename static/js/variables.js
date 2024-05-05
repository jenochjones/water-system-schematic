let modelDictVar = {};
let maxElevVar = 1000;
let minElevVar = 0;
let elevIntVar = 0;
let locIntVar = 0;


let setModelDict = function (modelDict) {
    modelDictVar = modelDict;
}

let getModelDict = function () {
    return modelDictVar;
}

let setMinElev = function (minElev) {
    minElevVar = minElev;
}

let getMinElev = function () {
    return minElevVar;
}

let setMaxElev = function (maxElev) {
    maxElevVar = maxElev;
}

let getMaxElev = function () {
    return maxElevVar;
}

let setElevInt = function (elevInt) {
    elevIntVar = elevInt;
}

let getElevInt = function () {
    return elevIntVar;
}

let setLocInt = function (locInt) {
    locIntVar = locInt;
}

let getLocInt = function () {
    return locIntVar;
}

export {
    setModelDict,
    getModelDict,
    setMinElev,
    getMinElev,
    setMaxElev,
    getMaxElev,
    setElevInt,
    getElevInt,
    setLocInt,
    getLocInt
}