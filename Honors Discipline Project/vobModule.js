

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Populate the insurance names and states dropdowns
    populateStates();
    populateInsuranceNames();

    // Add event listeners to treatment type radio buttons to update treatment levels
    document.getElementById("substanceAbuse").addEventListener("change", updateTreatmentLevels);
    document.getElementById("mentalHealth").addEventListener("change", updateTreatmentLevels);

    // Handle form submission
    document.getElementById("Form").addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit();
    });

    // Handle admit button click
    document.getElementById("admitButton").addEventListener("click", function () {
        alert("Forwarding to UR module for authorization review. Note: This is an administrative view.");
        const patient = getPatientFromForm();
        patient.saveToLocalStorage();
        window.location.href = "urModule.html"
        
    });

    // Handle decline button click
    document.getElementById("declineButton").addEventListener("click", function () {
        alert("Patient has been declined.");
        document.getElementById("submissionMessage").style.display = "none";
        document.getElementById("Form").style.display = "block";
    });
});

// Function to populate the insurance names dropdown
function populateInsuranceNames() {
    let insuranceNames = [
        { name: "Aetna", value: "AET" },
        { name: "Blue Cross Blue Shield", value: "BCBS" },
        { name: "Evernorth(Cigna)", value: "CG" },
        { name: "United Healthcare", value: "UHC" }];
    for (let x = 0; x < insuranceNames.length; x++) {
        let optionObject = document.createElement("option");
        optionObject.text = insuranceNames[x].name;
        optionObject.value = insuranceNames[x].value;
        document.querySelector("#insuranceName").appendChild(optionObject);
    }
}

// Function to populate the states dropdown
function populateStates() {
    let states = [
        { value: "AL", name: "Alabama" },
        { value: "AK", name: "Alaska" },
        { value: "AZ", name: "Arizona" },
        { value: "AR", name: "Arkansas" },
        { value: "CA", name: "California" },
        { value: "CO", name: "Colorado" },
        { value: "CT", name: "Connecticut" },
        { value: "DE", name: "Delaware" },
        { value: "FL", name: "Florida" },
        { value: "GA", name: "Georgia" },
        { value: "HI", name: "Hawaii" },
        { value: "ID", name: "Idaho" },
        { value: "IL", name: "Illinois" },
        { value: "IN", name: "Indiana" },
        { value: "IA", name: "Iowa" },
        { value: "KS", name: "Kansas" },
        { value: "KY", name: "Kentucky" },
        { value: "LA", name: "Louisiana" },
        { value: "ME", name: "Maine" },
        { value: "MD", name: "Maryland" },
        { value: "MA", name: "Massachusetts" },
        { value: "MI", name: "Michigan" },
        { value: "MN", name: "Minnesota" },
        { value: "MS", name: "Mississippi" },
        { value: "MO", name: "Missouri" },
        { value: "MT", name: "Montana" },
        { value: "NE", name: "Nebraska" },
        { value: "NV", name: "Nevada" },
        { value: "NH", name: "New Hampshire" },
        { value: "NJ", name: "New Jersey" },
        { value: "NM", name: "New Mexico" },
        { value: "NY", name: "New York" },
        { value: "NC", name: "North Carolina" },
        { value: "ND", name: "North Dakota" },
        { value: "OH", name: "Ohio" },
        { value: "OK", name: "Oklahoma" },
        { value: "OR", name: "Oregon" },
        { value: "PA", name: "Pennsylvania" },
        { value: "RI", name: "Rhode Island" },
        { value: "SC", name: "South Carolina" },
        { value: "SD", name: "South Dakota" },
        { value: "TN", name: "Tennessee" },
        { value: "TX", name: "Texas" },
        { value: "UT", name: "Utah" },
        { value: "VT", name: "Vermont" },
        { value: "VA", name: "Virginia" },
        { value: "WA", name: "Washington" },
        { value: "WV", name: "West Virginia" },
        { value: "WI", name: "Wisconsin" },
        { value: "WY", name: "Wyoming" }
    ];
    for (let x = 0; x < states.length; x++) {
        let optionObject = document.createElement("option");
        optionObject.text = states[x].name;
        optionObject.value = states[x].value;
        document.querySelector("#patientState").appendChild(optionObject);
    }
}

// Function to show/hide treatment level checkboxes based on selected treatment type
function updateTreatmentLevels() {
    const substanceAbuseLevels = document.getElementById("substanceAbuseLevels");
    const mentalHealthLevels = document.getElementById("mentalHealthLevels");

    if (document.getElementById("substanceAbuse").checked) {
        substanceAbuseLevels.style.display = "flex";
        mentalHealthLevels.style.display = "none";
    } else if (document.getElementById("mentalHealth").checked) {
        substanceAbuseLevels.style.display = "none";
        mentalHealthLevels.style.display = "flex";
    }
}

// Function to validate form input
function validateInfo() {
    let name = document.getElementById("patientsName").value;
    let memberID = document.getElementById("patientsMemberID").value;
    let insuranceName = document.getElementById("insuranceName").value;
    let ssn = document.getElementById("patientSSN").value;
    let dob = document.getElementById("patientDOB").value;
    let phone = document.getElementById("patientPhone").value;
    let address = document.getElementById("patientAddress").value;
    let city = document.getElementById("patientCity").value;
    let state = document.getElementById("patientState").value;
    let zip = document.getElementById("patientZip").value;
    let treatmentType = document.querySelector("input[name='treatmentType']:checked");

    // Check if all required fields are filled
    if (!name || !memberID || !insuranceName || !dob || !address || !city || !state || !zip || !treatmentType) {
        alert("Please fill out all the fields!");
        return false;
    }

    // Validate that name, city, and state contain only letters
    let textFields = [name, city, state];
    for (let field of textFields) {
        if (!/^[A-Za-z\s]+$/.test(field)) {
            alert("Name, city, and state fields should only contain letters.");
            return false;
        }
    }

    // Validate SSN format
    let ssnPattern = /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/;
    if (!ssn.match(ssnPattern)) {
        alert("Invalid SSN format. Please use the format 123-45-6789.");
        return false;
    }

    // Validate age (18 to 100 years)
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18 || age > 100) {
        alert("Age must be between 18 and 100.");
        return false;
    }

    // Validate phone number format
    let phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!phone.match(phonePattern)) {
        alert("Invalid phone number format. Please use the format 515-123-4567.");
        return false;
    }

    // Validate Zip Code format
    let zipPattern = /^[0-9]{5}$/;
    if (!zip.match(zipPattern)) {
        alert("Invalid Zip Code format. Please enter a 5-digit Zip Code.");
        return false;
    }

    // Ensure at least one level of care is selected
    let selectedLevels = document.querySelectorAll("input[name = 'levelCare']:checked");
    if (selectedLevels.length == 0) {
        alert("Please select atleast one level of care");
        return false;
    }
    return true;
}




// Function to handle form submission
function handleSubmit() {
    // Stop execution if validation fails
    if (!validateInfo()) {
        return;
    }

    const patient = getPatientFromForm();

    if (patient) {
        

        // Display submission message
        document.getElementById("submissionMessage").style.display = "block";
        document.getElementById("submittedData").innerText = `Patient ${patient.name} information submitted successfully.`;

        // Get estimate and benefits
        const { estimate, benefits } = patient.getEstimateAndBenefits();
        document.getElementById("estimate").innerText = `Estimate: ${estimate}`;
        document.getElementById("benefits").innerText = `Benefits: ${benefits}`;

        // Show estimate info and admit/decline buttons
        document.getElementById("estimateInfo").style.display = "block";
        document.getElementById("admitButton").style.display = "inline-block";
        document.getElementById("declineButton").style.display = "inline-block";

    

    }
}

// Function to get patient information from the form
function getPatientFromForm() {
    const treatmentTypeElement = document.querySelector('input[name="treatmentType"]:checked');
    const treatmentType = treatmentTypeElement ? treatmentTypeElement.value : null;

    if (!treatmentType) {
        alert("Please select a treatment type.");
        return null;
    }

    const formData = {
        name: document.getElementById("patientsName").value,
        memberID: document.getElementById("patientsMemberID").value,
        insuranceName: document.getElementById("insuranceName").value,
        ssn: document.getElementById("patientSSN").value,
        dob: document.getElementById("patientDOB").value,
        phone: document.getElementById("patientPhone").value,
        address: document.getElementById("patientAddress").value,
        city: document.getElementById("patientCity").value,
        state: document.getElementById("patientState").value,
        zip: document.getElementById("patientZip").value,
        treatmentType: treatmentType,
        levelsOfCare: Array.from(document.querySelectorAll("input[name='levelCare']:checked")).map(el => el.value)
    };

    return Patient.fromFormData(formData);
}



