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

function updateTailoredCv(tailoredCv) {
    tailoredCvParagraph.textContent = tailoredCv;
}

function updateRecommendations(recommendations) {
    tailoredCvParagraph.textContent = recommendations.join(", ");
}

// Submit Button
submitButton.addEventListener("click", async () => {
    if (!cvFile) {
        alert("No CV file was added.");
        return;
    }

    const jobOffer = jobOfferTextarea.value;
    const result = await tailorCv(cvFile, jobOffer);

    if (result) {
            updateTailoredCv(result["tailored_cv"]);
            updateMatchChart(result["match_score"]);
            updateRecommendations(result["recommendations"]);

            outputDiv.classList.remove("hidden");
    }
});

// Connection to FastAPI
function tailorCv (cv_file, job_offer) {
    const formData = new FormData();
    formData.append("cv_file", cv_file);
    formData.append("job_offer", job_offer);

    return fetch(`http://localhost:8080/api/tailor`,
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
