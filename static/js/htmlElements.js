import {getMaxElev, getMinElev, setElevInt, setLocInt, getModelDict } from "./variables.js"
import { makeDraggable } from "./events.js";


let drawValves = function () {
    const modelDict = getModelDict();
    const valves = modelDict['VALVES'].data;

    const pageMaxElev = getMaxElev();
    const pageMinElev = getMinElev();

    let x = 10;

    for (let valve in valves) {
        console.log(valve[0]);
        let elev = valves[valve][1];
        let valveDiv = document.createElement('div');
        let valveTop = document.createElement('div');
        let valveBottom = document.createElement('div');
        let mainWindow = document.getElementById('main-window');

        valveDiv.classList.add('valve-div');
        valveDiv.style.position = 'absolute';
        valveDiv.style.bottom = `${2 + (elev - pageMinElev) * (93) / (pageMaxElev - pageMinElev)}%`;
        valveDiv.style.left = `${x}%`;
        valveTop.classList.add('valve-top');
        valveBottom.classList.add('valve-bottom');
        valveDiv.appendChild(valveBottom);
        valveDiv.appendChild(valveTop);
        mainWindow.appendChild(valveDiv);
        
        x += 10;
    }
}

let drawPumps = function () {
    const modelDict = getModelDict();
    const pumps = modelDict['PUMPS'].data;

    const pageMaxElev = getMaxElev();
    const pageMinElev = getMinElev();

    let x = 10;

    for (let pump in pumps) {
        console.log(pump[0]);
        let elev = pumps[pump][1];
        let pumpDiv = document.createElement('div');
        let pumpTop = document.createElement('div');
        let pumpBottom = document.createElement('div');
        let mainWindow = document.getElementById('main-window');

        pumpDiv.classList.add('pump-div');
        pumpDiv.style.position = 'absolute';
        pumpDiv.style.bottom = `${2 + (elev - pageMinElev) * (93) / (pageMaxElev - pageMinElev)}%`;
        pumpDiv.style.left = `${x}%`;
        pumpTop.classList.add('pump-top');
        pumpBottom.classList.add('pump-bottom');
        pumpDiv.appendChild(pumpBottom);
        pumpDiv.appendChild(pumpTop);
        mainWindow.appendChild(pumpDiv);
        
        x += 10;
    }
}

let drawTanks = function () {
    const modelDict = getModelDict();
    const tanks = modelDict['TANKS'].data;

    const pageMaxElev = getMaxElev();
    const pageMinElev = getMinElev();

    let x = 10;

    for (let tank in tanks) {
        console.log(tank[0]);
        let elev = tanks[tank][1];
        let tankDiv = document.createElement('div');
        let tankTop = document.createElement('div');
        let tankBottom = document.createElement('div');
        let mainWindow = document.getElementById('main-window');

        tankDiv.classList.add('tank-div');
        tankDiv.style.position = 'absolute';
        tankDiv.style.bottom = `${2 + (elev - pageMinElev) * (93) / (pageMaxElev - pageMinElev)}%`;
        tankDiv.style.left = `${x}%`;
        tankTop.classList.add('tank-top');
        tankBottom.classList.add('tank-bottom');
        tankDiv.appendChild(tankBottom);
        tankDiv.appendChild(tankTop);
        mainWindow.appendChild(tankDiv);
        
        x += 10;
    }

    let tankDivs = document.getElementsByClassName('tank-div');

    tankDivs = Array.from(tankDivs);
    debugger
    tankDivs.forEach(tdiv => {
        makeDraggable(tdiv);
    });
}

let drawZones = function (zones) {
    
    let numZones = Object.keys(zones).length;

    const pageMaxElev = getMaxElev();
    const pageMinElev = getMinElev();

    let zoneWidth = 100 / numZones - 5;
    let x = 2.5;

    const mainWindow = document.getElementById('main-window');

    for (let zone in zones) {
        let maxElev = zones[zone]['MaxElev'];
        let minElev = zones[zone]['MinElev'];

        console.log(`${zone}: ${maxElev}, ${minElev}`);

        const newDiv = document.createElement('div');

        // Set class and inline styles
        newDiv.classList.add('zone');
        newDiv.style.left = `${x}%`;
        newDiv.style.bottom = `${2 + (minElev - pageMinElev) * (93) / (pageMaxElev - pageMinElev)}%`;
        newDiv.style.top = `${2 + (maxElev - pageMinElev) * (93) / (pageMaxElev - pageMinElev)}%`;
        newDiv.style.width = `${zoneWidth}%`;

        // Set innerHTML to zone
        newDiv.textContent = zone;

        mainWindow.appendChild(newDiv);
        x += zoneWidth + 5;
    }
}

let handleFileUpload = function (event) {
    let input = document.createElement('input');
    input.type = 'file';

    input.addEventListener('change', function () {
        let file = input.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onload = function () {
                let image = document.createElement('img');
                image.src = reader.result;
                image.style.maxWidth = '100%';
                image.style.maxHeight = '100%';
                document.getElementById('logo').innerHTML = '';
                document.getElementById('logo').appendChild(image);
            };

            reader.readAsDataURL(file);
        }
    });
    input.click();
}


let drawElevLines = function () {
    const maxElev = getMaxElev();
    const minElev = getMinElev();
    const maxElevRound = Math.ceil(maxElev / 10) * 10;
    const minElevRound = Math.floor(minElev / 10) * 10;
    const elevDiff = maxElevRound - minElevRound;
    const elevInt = document.getElementById("elev-int").value;
    const numOfElev = elevDiff / elevInt + 1;
    const locInt = 95 / numOfElev;

    let elevationsDiv = document.getElementById('elevations');
    let mainWindowDiv = document.getElementById('main-window');

    setElevInt(elevInt);
    setLocInt(locInt);

    while (elevationsDiv.firstChild) {
        elevationsDiv.removeChild(elevationsDiv.firstChild);
    }

    while (mainWindowDiv.firstChild) {
        mainWindowDiv.removeChild(mainWindowDiv.firstChild);
    }

    for (let i = 0; i < numOfElev + 1; i++) {
        let elev = minElevRound + elevInt * i;
        let loc = 2 + locInt * i;

        if (loc < 100) {
            let paragraph = document.createElement('p');
            paragraph.textContent = elev;
            paragraph.style.position = 'absolute';
            paragraph.style.bottom = `calc(${loc}% - 0.5em)`;
            paragraph.style.margin = `0`;
            paragraph.style.height = '1em';
            paragraph.style.color = 'gray';
            paragraph.style.fontSize = '10pt';
            elevationsDiv.appendChild(paragraph);
    
            let dashedLine = document.createElement('div');
            dashedLine.style.position = 'absolute';
            dashedLine.style.bottom = `${loc}%`;
            dashedLine.style.borderTop = '1px dashed gray';
            dashedLine.style.margin = `0`;
            dashedLine.style.height = '0';
            dashedLine.style.width = '100%';
            mainWindowDiv.appendChild(dashedLine);
        }
    }
};

export {
    drawElevLines,
    drawZones,
    drawTanks,
    drawPumps,
    drawValves,
    handleFileUpload
}
