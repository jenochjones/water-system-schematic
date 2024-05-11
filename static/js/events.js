import { createModelDict, getMinMax, assignZones } from "./schematic.js";
import { setModelDict, setMaxElev, setMinElev, getMaxElev, getMinElev } from "./variables.js";
import { drawElevLines, drawZones, drawTanks, drawPumps, handleFileUpload } from "./htmlElements.js"

let handleFile = function () {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const contents = event.target.result;
                // Assuming the text file contains plain text, you can directly resolve with its content
                const textVariable = contents;
                resolve(textVariable);
            };

            reader.onerror = function(error) {
                reject(error);
            };

            reader.readAsText(file);
        } else {
            reject(new Error("No file selected."));
        }
    });
};

let printDiv = function (divId) {
    // Clone the target div and its contents
    let printableArea = document.getElementById(divId).cloneNode(true);

    // Create a new window or tab
    let printWindow = window.open('', '_blank');

    // Create a link element to include the CSS file in the new window
    let cssLink = printWindow.document.createElement('link');
    cssLink.href = 'static/styles.css';  // Replace with the path to your CSS file
    cssLink.rel = 'stylesheet';

    // Attach an onload event to the link element
    cssLink.onload = function () {
        // Append the cloned div to the new window or tab
        printWindow.document.body.appendChild(printableArea);
        printWindow.document.getElementById('white-rectangle').style.width = '432mm';
        printWindow.document.getElementById('white-rectangle').style.height = '279mm';

        //279mm by 432mm
        //210mm by 297mm

        // Trigger the print dialog
        printWindow.print();
    };

    // Append the link element to the head of the new window
    printWindow.document.head.appendChild(cssLink);
    

    printWindow.document.body.style.margin = '0';
    printWindow.document.body.style.padding = '0';
}

let makeDraggable = function(element) {
    let pos1 = 0, pos3 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos1 = e.clientX;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position:
        let newX = pos1 - e.clientX;
        pos1 = e.clientX;
        // Calculate new position as a percentage:
        let containerWidth = element.parentNode.clientWidth;
        let newPosition = ((element.offsetLeft - newX) / containerWidth) * 100;
        // Ensure the element stays within bounds
        newPosition = Math.max(0, Math.min(newPosition, 100));
        // Set the element's new position:
        element.style.left = newPosition + "%";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



let setEventListeners = function () {
    document.getElementById('fileInput').addEventListener('change', async (event) => {
        const modelText = await handleFile();
        let modelDict = createModelDict(modelText);
        setModelDict(modelDict);
        const maxMin = getMinMax(modelDict);
        setMaxElev(maxMin[0]);
        setMinElev(maxMin[1]);
        drawElevLines(maxMin[0], maxMin[1]);
        let zones = assignZones(modelDict);
        drawZones(zones);
        drawTanks();
        drawPumps();
    });

    document.getElementById('printBtn').addEventListener("click", (event) => {
        printDiv('white-rectangle');
    });

    document.getElementById('elev-int').addEventListener('change', (event) => {
        const maxElev = getMaxElev();
        const minElev = getMinElev();
        drawElevLines(maxElev, minElev);
    })

    document.getElementById('logo').addEventListener('click', handleFileUpload);
}

export {
    setEventListeners,
    makeDraggable
};