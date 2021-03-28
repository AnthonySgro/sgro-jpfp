function studentProfileValidator() {
    const firstName = document.querySelector("#first-name-editor");
    const lastName = document.querySelector("#last-name-editor");
    const gpa = document.querySelector("#gpa-editor");
    const emailEditor = document.querySelector("#email-editor");

    let allValid = true;

    if (firstName.value === "") {
        firstName.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        firstName.style.backgroundColor = "";
        firstName.placeholder = "";
    }

    if (lastName.value === "") {
        lastName.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        lastName.style.backgroundColor = "";
        lastName.placeholder = "";
    }

    // Reg ex making sure our gpa is nothing but numbers and decimals
    const pattern = new RegExp("^[0-9]+([.][0-9]+)?$");
    if (gpa.value * 1 < 0 || gpa.value * 1 > 4) {
        gpa.style.backgroundColor = "#ff9999";
        allValid = false;
    } else if (!pattern.test(gpa.value)) {
        gpa.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        gpa.style.backgroundColor = "";
        gpa.placeholder = "";
    }

    if (emailEditor.value === "") {
        emailEditor.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        emailEditor.style.backgroundColor = "";
        emailEditor.placeholder = "";
    }

    return allValid;
}

export default studentProfileValidator;
