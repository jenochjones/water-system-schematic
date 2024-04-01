let getMinElevation = function (idsWithElevation, targetIds) {
    let minElevation = Number.POSITIVE_INFINITY;

    // Iterate through the IDs with elevation
    for (let i = 0; i < idsWithElevation.length; i++) {
        const id = idsWithElevation[i][0]; // ID is in the first column
        const elevation = idsWithElevation[i][1]; // Elevation is in the second column

        // Check if the current ID is in the target IDs
        if (targetIds.includes(id)) {
            // Update min elevation if the current elevation is smaller
            if (elevation < minElevation) {
                minElevation = elevation;
            }
        }
    }

    return minElevation;
}

let getMaxElevation = function (idsWithElevation, targetIds) {
    let maxElevation = Number.NEGATIVE_INFINITY;

    // Iterate through the IDs with elevation
    for (let i = 0; i < idsWithElevation.length; i++) {
        const id = idsWithElevation[i][0]; // ID is in the first column
        const elevation = idsWithElevation[i][1]; // Elevation is in the second column

        // Check if the current ID is in the target IDs
        if (targetIds.includes(id)) {
            // Update max elevation if the current elevation is greater
            if (elevation > maxElevation) {
                maxElevation = elevation;
            }
        }
    }

    return maxElevation;
}

let assignZones = function (modelDict) {
    
    // Initialize an adjacency list to represent the graph
    //let reservoirs = modelDict['RESERVOIRS'].data.map(row => [row[0]]);
    //let pumps = modelDict['PUMPS'].data.map(row => [row[0]]);
    //let tanks = modelDict['TANKS'].data.map(row => [row[0]]);
    //let valves = modelDict['VALVES'].data.map(row => [row[0]]);
    let nodes = modelDict['JUNCTIONS'].data.map(row => [row[0]]);
    //let nodes = [...juncts, ...tanks, ...reservoirs];
    let pipes = modelDict['PIPES'].data.map(row => row.slice(0, 3));
    //pipes = [...pipes, ...pumps];//, ...valves];

    let zones = {};

    const adjacencyList = {};

    // Populate adjacency list
    pipes.forEach(pipe => {
        const [pipeId, startNodeId, endNodeId] = pipe;
        if (!adjacencyList[startNodeId]) adjacencyList[startNodeId] = [];
        if (!adjacencyList[endNodeId]) adjacencyList[endNodeId] = [];
        adjacencyList[startNodeId].push(endNodeId);
        adjacencyList[endNodeId].push(startNodeId); // Assuming pipes are bidirectional
    });

    // Initialize visited nodes and result array
    const visited = {};
    const groups = [];

    // Define DFS function
    function dfs(node, group) {
        visited[node] = true;
        group.push(node);
        if (adjacencyList[node]) {
            adjacencyList[node].forEach(neighbor => {
                if (!visited[neighbor]) {
                    dfs(neighbor, group);
                }
            });
        }
    }

    // Perform DFS for each unvisited node
    nodes.forEach(node => {
        if (!visited[node]) {
            const group = [];
            dfs(node, group);
            if (group.length > 5) { // Only add groups with more than 5 elements
                groups.push(group);
            }
        }
    });

    let counter = 1;
    
    groups.forEach(group => {
        zones[`Zone ${counter}`] = {};
        zones[`Zone ${counter}`]['JUNCTIONS'] = group;
        let maxElev = getMaxElevation(modelDict['JUNCTIONS'].data.map(row => [row[0], row[1]]), group);
        let minElev = getMinElevation(modelDict['JUNCTIONS'].data.map(row => [row[0], row[1]]), group);
        zones[`Zone ${counter}`]['MaxElev'] = maxElev;
        zones[`Zone ${counter}`]['MinElev'] = minElev;
        counter++;
    });

    debugger
    return zones;
}

/*
let assignZones = function (modelDict) {
    console.log(modelDict)
    debugger
    const tankData = modelDict['TANKS'].data;
    const tankHeads = tankData.map(row => parseFloat(row[1]) + parseFloat(row[2]));
    const tankIDS = tankData.map(row => row[0]);

    const valveData = modelDict['VALVES'].data;
    const junctData = modelDict['JUNCTIONS'].data;
    const resData = modelDict['RESERVOIRS'].data;

    const junctIDS = junctData.map(row => row[0]);
    const junctElevs = junctData.map(row => row[1]);
    const valveIDS = valveData.map(row => row[0]);
    const valveElev = valveData.map(row => (parseFloat(junctElevs[junctIDS.indexOf(row[1])]) + parseFloat(junctElevs[junctIDS.indexOf(row[1])])) / 2);
    debugger
    const valveHeads = valveData.map(row => (row[4] === "PRV") ? parseFloat(valveElev[valveIDS.indexOf(row[0])]) + parseFloat(row[5]) * 2.31 : null);

    const resIDS = resData.map(row => row[0]);
    const resHeads = resData.map(row => parseFloat(row[1]));

    const IDS = [...tankIDS.map(row => `tank_${row}`), ...resIDS.map(row => `res_${row}`), ...valveIDS.map(row => `valve_${row}`)]
    const heads = [...tankHeads, ...resHeads, ...valveHeads];
}*/

let getMinMax = function (modelDict) {

    let elementList = ['TANKS', 'JUNCTIONS'];
    let maxElevs = [];
    let minElevs = [];
        
    for (let element in elementList) {
        const data = modelDict[elementList[element]].data;
        const elevations = data.map(row => parseFloat(row[1]));
        maxElevs.push(Math.max(...elevations));
        minElevs.push(Math.min(...elevations));
    }
    
    return [Math.max(...maxElevs), Math.min(...minElevs)]
}

let  createModelDict = function (inputText) {
    const list_of_headers = {
        'COORDINATES': ['NODE ID', 'X-COORDINATE', 'Y-COORDINATE'],
        'CURVES': ['CURVE ID', 'X-VALUE', 'Y-VALUE'],
        'DEMANDS': ['JUNCTION ID', 'BASE DEMAND', 'DEMAND PATTERN ID'],
        'JUNCTIONS': ['ID', 'ELEVATION', 'BASE DEMAND FLOW', 'DEMAND PATTERN ID'],
        'PIPES': ['ID', 'START NODE ID', 'END NODE ID', 'LENGTH', 'DIAMETER', 'ROUGHNESS COEFFICIENT', 'MINOR LOSS COEFFICIENT', 'STATUS'],
        'PUMPS': ['ID', 'START NODE ID', 'END NODE ID', 'KEYWORDS AND VALUES'],
        'RESERVOIRS': ['ID', 'HEAD', 'HEAD PATTERN ID'],
        'SOURCES': [],
        'STATUS': [],
        'TANKS': ['ID', 'BOTTOM ELEVATION', 'INITIAL WATER LEVEL', 'MINIMUM WATER LEVEL', 'NOMINAL DIAMETER', 'MINIMUM VOLUME', 'VOLUME CURVE ID'],
        'TITLE': [],
        'VALVES': ['ID', 'START NODE ID', 'END NODE ID', 'DIAMETER', 'VALVE TYPE', 'VALVE SETTING', 'MINOR LOSS COEFFICIENT'],
        'VERTICIES': ['PIPE ID', 'X-COORDINATE', 'Y-COORDINATE']
    };

    let parseSection = function (sectionLines, header) {
        let data = [];
        let newColCount = 1;
        for (let line of sectionLines) {
            line = line.trim();
            if (!line || line.startsWith(";")) {
                continue;
            }

            let comment = '';
            if (line.includes(';')) {
                const parts = line.split(';');
                line = parts[0];
                comment = parts[1];
            }

            let parts = line.split('\t');
            while (parts.length < header.length) {
                parts.push('');
            }
            while (header.length < parts.length) {
                header.push(`Col_${newColCount}`);
                newColCount++;
            }

            data.push(parts.concat([comment]));
        }
        if (!data.length) {
            return null;
        }
        const df = { data: data, columns: header.concat(['Comment']) };
        return df;
    }

    const lines = inputText.split('\n');

    const dataDict = {};
    let currentSection = null;
    let currentLines = [];

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith("[") && line.endsWith("]")) {
            if (currentSection) {
                const colNames = list_of_headers[currentSection] || ['Col_0'];
                const df = parseSection(currentLines, colNames);
                dataDict[currentSection] = df ? df : null;
            }
            currentSection = line.substring(1, line.length - 1);
            currentLines = [];
        } else {
            currentLines.push(line);
        }
    }

    if (currentSection && currentSection.toLowerCase() !== 'end') {
        const colNames = list_of_headers[currentSection] || ['Col_0'];
        const df = parseSection(currentLines, colNames);
        dataDict[currentSection] = df ? df : null;
    }

    return dataDict;
}

export {
    createModelDict,
    getMinMax,
    assignZones
};
