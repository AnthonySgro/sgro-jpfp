function studentProfileValidator() {
    const firstName = document.querySelector("#first-name-editor");
    const lastName = document.querySelector("#last-name-editor");
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
