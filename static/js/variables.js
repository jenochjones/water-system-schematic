let modelDictVar = {};
let maxElevVar = 1000;
let minElevVar = 0;


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

export {
    setModelDict,
    getModelDict,
    setMinElev,
    getMinElev,
    setMaxElev,
    getMaxElev
}