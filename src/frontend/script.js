// HTML Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('cv-file');
const fileNameDisplay = document.getElementById('drop-file-name');

// Event Listeners

// Clicking field on dropZone
dropZone.addEventListener("click", () => fileInput.click());

// Displaying the name of the file after selecting it
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
    }
});

// Visual effects of dragging the mouse over dropZone
["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });
});

// Drop handling
dropZone.addEventListener("drop", (e) => {
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
        fileInput.files = droppedFiles;
        fileNameDisplay.textContent = `Selected: ${droppedFiles[0].name}`;
    }
});

// Match Doughnut Chart
function updateMatchChart(score) {
    const chart = document.getElementById('match-chart');
    const percentageText = document.getElementById('chart-percentage');

    percentageText.textContent = `${score}%`;

    chart.style.setProperty('--percentage', `${score}%`);
}

updateMatchChart(80);
