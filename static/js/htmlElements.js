import {getMaxElev, getMinElev} from "./variables.js"

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
    console.log(minElev);
    console.log(maxElev);
    const maxElevRound = Math.ceil(maxElev / 10) * 10;
    const minElevRound = Math.floor(minElev / 10) * 10;
    const elevDiff = maxElevRound - minElevRound;
    const elevInt = document.getElementById("elev-int").value;
    const numOfElev = elevDiff / elevInt + 1;
    const locInt = 95 / numOfElev;

    let elevationsDiv = document.getElementById('elevations');
    let mainWindowDiv = document.getElementById('main-window');

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
    handleFileUpload
}