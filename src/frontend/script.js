// HTML Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("cv-file");
const fileNameDisplay = document.getElementById("drop-file-name");
const submitButton = document.getElementById("submit-button");
const outputDiv = document.getElementById("output");
const tailoredCvParagraph = document.getElementById("tailored-cv-paragraph");
const recommendationsParagraph = document.getElementById("recommendations-paragraph");
const chart = document.getElementById("match-chart");
const percentageText = document.getElementById("chart-percentage");

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

// Update HTML
function updateMatchChart(score) {
    percentageText.textContent = `${score}%`;
    chart.style.setProperty('--percentage', `${score}%`);
}

function updateTailoredCv(tailoredCv) {
    tailoredCvParagraph.textContent = tailoredCv;
}

function updateRecommendations(recommendations) {
    tailoredCvParagraph.textContent = recommendations.join(", ");
}

// Submit Button
submitButton.addEventListener("click", () => {
    outputDiv.classList.remove("hidden");
})