function campusProfileValidator(submit) {
    const name = document.querySelector("#campus-name-editor");
    const address = document.querySelector("#address-editor");
    let allValid = true;

    if (name.value === "") {
        name.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        name.style.backgroundColor = "";
        name.placeholder = "";
    }

    if (address.value === "") {
        address.style.backgroundColor = "#ff9999";
        allValid = false;
    } else {
        address.style.backgroundColor = "";
        address.placeholder = "";
    }

    return allValid;
}

export default campusProfileValidator;
