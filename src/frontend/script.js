// HTML Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("cv-file");
const fileNameDisplay = document.getElementById("drop-file-name");
const jobOfferTextarea = document.getElementById("job-offer-textarea")
const submitButton = document.getElementById("submit-button");
const outputDiv = document.getElementById("output");
const tailoredCvButton = document.getElementById("tailored-cv-button");
const recommendationsList = document.getElementById("recommendations-list");
const chart = document.getElementById("match-chart");
const percentageText = document.getElementById("chart-percentage");
const spinner = document.getElementById("loading-spinner");
const spinnerLabel = document.getElementById("spinner-label");

let cvFile = null;

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

// Saving pdf after selecting it
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    cvFile = e.dataTransfer.files[0];
});

fileInput.addEventListener("change", (e) => {
    cvFile = e.target.files[0];
});


// Update HTML
function updateMatchChart(score) {
    percentageText.textContent = `${score}%`;
    chart.style.setProperty('--percentage', `${score}%`);
}

function updateRecommendations(recommendations) {
    recommendationsList.innerHTML = "";
    for (const recommendation of recommendations) {
        const newRecommendationItem = document.createElement("li");
        newRecommendationItem.textContent = recommendation;
        recommendationsList.appendChild(newRecommendationItem);
    }
}

// Submit Button
submitButton.addEventListener("click", async () => {
    if (!cvFile) {
        alert("No CV file was added.");
        return;
    }

    spinnerLabel.classList.remove("hidden");
    spinner.classList.remove("hidden");
    submitButton.disabled = true;

    spinner.scrollIntoView({ behavior: "smooth", block: "center" });

    try {
        const jobOffer = jobOfferTextarea.value;
        const result = await tailorCv(cvFile, jobOffer);

        if (result) {
            updateMatchChart(result["match_score"]);
            updateRecommendations(result["recommendations"]);
            tailoredCvButton.onclick = () => openPdfInNewTab(result["tailored_cv"]);

            outputDiv.classList.remove("hidden");
            tailoredCvButton.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    } catch (error) {
        alert("Failed to tailor CV. Check the logs for more info.");
    } finally {
        spinner.classList.add("hidden");
        spinnerLabel.classList.add("hidden");
        submitButton.disabled = false;
    }
});

// PDF handling
function openPdfInNewTab(base64String) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
}

// Connection to FastAPI
function tailorCv (cv_file, job_offer) {
    const formData = new FormData();
    formData.append("cv_file", cv_file);
    formData.append("job_offer", job_offer);

    return fetch(`http://localhost:8000/tailor`,
        {
            method: `POST`,
            body: formData
        }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error Status: ${response.status}`);
        }
        if (response.status === 204) {
            return null; 
        }
        
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log("CV tailored successfully:", data);
        } else {
            console.log("CV tailored successfully.");
        }
        return data;
    })
    .catch(error => console.error("Error while tailoring the CV:", error));
}
