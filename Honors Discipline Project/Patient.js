class Patient {
    constructor(name, memberID, insuranceName, ssn, dob, phone, address, city, state, zip, treatmentType, levelsOfCare = []) {
        this.name = name;
        this.memberID = memberID;
        this.insuranceName = insuranceName;
        this.ssn = ssn;
        this.dob = dob;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.treatmentType = treatmentType;
        this.levelsOfCare = levelsOfCare;
    }



    static fromFormData(formData) {
        return new Patient(
            formData.name,
            formData.memberID,
            formData.insuranceName,
            formData.ssn,
            formData.dob,
            formData.phone,
            formData.address,
            formData.city,
            formData.state,
            formData.zip,
            formData.treatmentType,
            formData.levelsOfCare || []
        );
    }

    // Method to calculate estimate and benefits based on the patient's information
    getEstimateAndBenefits() {
        let estimate = "";
        let benefits = "";

        // Calculate estimate based on insurance
        if (this.insuranceName == "AET") {
            estimate = "$2000";
            benefits = "Covers most inpatient and outpatient treatments.";
        } else if (this.insuranceName == "BCBS") {
            estimate = "$2500";
            benefits = "Includes comprehensive coverage for substance abuse and mental health.";
        } else if (this.insuranceName == "CG") {
            estimate = "$2200";
            benefits = "Coverage for a wide range of treatments with a focus on preventive care.";
        } else if (this.insuranceName == "UHC") {
            estimate = "$2300";
            benefits = "Offers extensive coverage with additional support for chronic conditions.";
        } else {
            estimate = "N/A";
            benefits = "No benefits information available for the selected insurance.";
        }

        // Append benefits based on treatment type
        if (this.treatmentType == "substanceAbuse") {
            benefits += " Specialized substance abuse programs included.";
        } else if (this.treatmentType == "mentalHealth") {
            benefits += " Comprehensive mental health support available.";
        }

        // Append benefits based on selected levels of care
        this.levelsOfCare.forEach(level => {
            if (level == "H0010") benefits += " Detox is covered.";
            if (level === "H0018") benefits += " Residential treatment is included.";
            if (level == "S0201") benefits += " PHP coverage available.";
            if (level == "H0015") benefits += " IOP is covered.";
            if (level == "90853") benefits += " OP - Group therapy is included.";
            if (level == "90834") benefits += " OP - Individual therapy is covered.";
            if (level == "H0035") benefits += " PHP for mental health is available.";
            if (level == "S9480") benefits += " IOP for mental health is included.";
        });

        return { estimate, benefits };
    }

    saveToLocalStorage() {
        localStorage.setItem('patientData', JSON.stringify(this));
    }

    // Retrieve patient data from localStorage
    static getFromLocalStorage() {
        const patientData = localStorage.getItem('patientData');
        if (patientData) {
            const data = JSON.parse(patientData);
            return new Patient(data.name, data.memberID, data.insuranceName, data.ssn, data.dob, data.phone, data.address, data.city, data.state, data.zip, data.treatmentType, data.levelsOfCare);
        } else {
            return null;
        }
    }
}