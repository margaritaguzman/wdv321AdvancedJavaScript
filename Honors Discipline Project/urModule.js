// Wait until the DOM is fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {

    localStorage.removeItem("authRequests");
    
    const patientInfo = Patient.getFromLocalStorage();
    let admitDate = new Date();
    admitDate = formatDate(admitDate);
    patientInfo.admitDate = admitDate;
    populatePatientInfo(patientInfo);
    patientInfo.saveToLocalStorage();
    displayAuthorizationDetails(patientInfo);
});


function populatePatientInfo(patient) {
    document.getElementById("patientName").innerText = patient.name || "N/A";
    document.getElementById("patientMemberID").innerText = patient.memberID || "N/A";
    document.getElementById("insuranceName").innerText = patient.insuranceName || "N/A";
    document.getElementById("patientSSN").innerText = patient.ssn || "N/A";
    document.getElementById("patientDOB").innerText = patient.dob || "N/A";
    document.getElementById("patientPhone").innerText = patient.phone || "N/A";
    document.getElementById("patientAddress").innerText = patient.address || "N/A";
    document.getElementById("patientCity").innerText = patient.city || "N/A";
    document.getElementById("patientState").innerText = patient.state || "N/A";
    document.getElementById("patientZip").innerText = patient.zip || "N/A";
    document.getElementById("treatmentType").innerText = patient.treatmentType || "N/A";
    document.getElementById("levelsOfCare").innerText = patient.levelsOfCare.join(", ") || "N/A";
}

// Function to update levels of care display based on selected treatment type
function updateTreatmentLevels() {
    let substanceAbuseLevels = document.getElementById("substanceAbuseLevels");
    let mentalHealthLevels = document.getElementById("mentalHealthLevels");

    if (document.getElementById("substanceAbuse").checked) {
        substanceAbuseLevels.style.display = "flex";
        mentalHealthLevels.style.display = "none";
    } else if (document.getElementById("mentalHealth").checked) {
        substanceAbuseLevels.style.display = "none";
        mentalHealthLevels.style.display = "flex";
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function displayAuthorizationDetails(patient) {
    const admitDate = patient.admitDate || "N/A";
    const treatmentType = patient.treatmentType || "N/A";
    const levelsOfCare = patient.levelsOfCare || [];

    // Show admit date
    document.getElementById("admitDate").innerText = admitDate;

    // Show treatment type
    document.getElementById("treatmentTypeDisplay").innerText = treatmentType;

    // Show levels of care
    document.getElementById("levelsOfCareDisplay").innerText = levelsOfCare.join(", ") || "N/A";

    // Handle pending authorization requests
    const authRequests = getAuthorizationRequests();
    const authRequestsContainer = document.getElementById("authRequestsContainer");

    authRequestsContainer.innerHTML = "";

    authRequests.forEach(request => {
        const requestElement = document.createElement("div");
        requestElement.classList.add("authRequest");
        requestElement.innerHTML = `
            <p><strong>Treatment Type:</strong> ${request.treatmentType}</p>
            <p><strong>Level of Care:</strong> ${request.levelOfCare}</p>
            <p><strong>Notes:</strong> ${request.notes}</p>
            <p><strong>Start Date:</strong> ${formatDate(new Date(request.startDate))}</p>
            <p><strong>End Date:</strong> ${formatDate(new Date(request.endDate))}</p>
            <p><strong>Status:</strong>
                <select id="statusDropdown-${request.id}" onchange="updateRequestStatus(${request.id})">
                    <option value="Pending" ${request.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Approved" ${request.status === "Approved" ? "selected" : ""}>Approved</option>
                    <option value="Denied" ${request.status === "Denied" ? "selected" : ""}>Denied</option>
                </select>
            </p>
            <button onclick="removeAuthorizationRequest(${request.id})">Remove</button>
            `;
        authRequestsContainer.appendChild(requestElement);
    });
}

// Function to get stored authorization requests
function getAuthorizationRequests() {
    const requests = JSON.parse(localStorage.getItem("authRequests")) || [];
    return requests;
}

// Function to approve authorization request
function approveAuthorizationRequest(requestId) {
    const requests = getAuthorizationRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
        requests[requestIndex].status = "Approved"; // Update status to approved
        localStorage.setItem("authRequests", JSON.stringify(requests)); // Store updated requests in localStorage

        // Re-render authorization details after approval
        displayAuthorizationDetails(Patient.getFromLocalStorage());
    }
}

// Function to add a new pending authorization request
function addAuthorizationRequest() {
    const patient = Patient.getFromLocalStorage();
    const treatmentType = patient.treatmentType;
    const levelsOfCare = patient.levelsOfCare.join(", ");
    const notes = document.getElementById("authorizationNotes").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const requests = getAuthorizationRequests();
    const newRequest = {
        id: requests.length + 1,
        treatmentType: treatmentType,
        levelOfCare: levelsOfCare,
        status: "Pending",
        notes: notes,
        startDate: startDate,
        endDate: endDate
    };

    requests.push(newRequest);
    localStorage.setItem("authRequests", JSON.stringify(requests));

    // Re-render authorization details after adding a new request
    displayAuthorizationDetails(patient);
}

function removeAuthorizationRequest(requestId) {
    const requests = getAuthorizationRequests();

    // Filter out the request to be removed
    const updatedRequests = requests.filter(request => request.id !== requestId);

    // Update localStorage with the filtered requests
    localStorage.setItem("authRequests", JSON.stringify(updatedRequests));

    // Re-render authorization details after removal
    displayAuthorizationDetails(Patient.getFromLocalStorage());
}

function updateRequestStatus(requestId) {
    // Get the list of authorization requests from localStorage
    const requests = getAuthorizationRequests();

    // Find the request by its ID
    const request = requests.find(req => req.id === requestId);

    // Ensure that the request was found
    if (!request) {
        console.error("Request not found!");
        return;
    }

    // Get the new status from the dropdown
    const statusDropdown = document.getElementById(`statusDropdown-${requestId}`);
    const newStatus = statusDropdown.value;

    // Prompt the user for a note (you can customize this part, use a textarea, etc.)
    const note = prompt("Enter a note for this status update:");

    // If the user entered a note, update the request
    if (note !== null) {
        request.status = newStatus;
        request.notes = note;

        // Save the updated requests to localStorage
        localStorage.setItem("authRequests", JSON.stringify(requests));

        // Re-render the updated requests
        displayAuthorizationDetails(Patient.getFromLocalStorage());
    }
}