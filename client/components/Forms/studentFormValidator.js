function studentFormValidator(allStudents) {
    const form = document.getElementById("form");
    const btn = document.getElementById("submit-btn-form");
    const firstName = document.getElementById("student-firstname-input");
    const lastName = document.getElementById("student-lastname-input");
    const email = document.getElementById("student-email-input");
    const imgUrl = document.getElementById("campus-imgUrl-input");

    // Show input error message
    function showError(input, message) {
        const formControl = input.parentElement;
        formControl.className = "form-control attn error";
        const small = formControl.querySelector("small");
        small.innerText = message;
    }

    //Show success outline
    function showSuccess(input) {
        const formControl = input.parentElement;
        formControl.className = "form-control attn success";
    }

    // Get field name
    function getFieldName(input) {
        const name = input.id.charAt(0).toUpperCase() + input.id.slice(1);
        return name.replace(/-/g, " ").substring(0, name.length - 6);
    }

    // Check input length
    function checkLength(input, min, max) {
        if (input.value.length < min) {
            showError(
                input,
                `${getFieldName(input)} must be at least ${min} characters`,
            );
        } else if (input.value.length > max) {
            showError(
                input,
                `${getFieldName(input)} must be less than ${max} characters`,
            );
        } else {
            showSuccess(input);
        }
    }

    function checkRequired(inputArr) {
        inputArr.forEach((input) => {
            if (input.required) {
                if (input.field.value.trim() === "") {
                    showError(
                        input.field,
                        `${getFieldName(input.field)} is required`,
                    );
                } else {
                    showSuccess(input.field);
                }
            }
        });
    }

    // Check url validity
    function checkUrl(input) {
        const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        if (re.test(input.value.trim()) || input.value.trim() === "") {
            showSuccess(input);
        } else {
            showError(input, "Url is not valid");
        }
    }

    function checkEmail(input) {
        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (re.test(input.value.trim())) {
            showSuccess(input);
        } else {
            showError(input, "Email is not valid");
        }
    }

    function checkDuplicateEmail(email, allStudents) {
        for (let student of allStudents) {
            if (email.value === student.email) {
                showError(email, "Email is already in use");
            }
        }
    }

    checkRequired([
        { field: firstName, required: true },
        { field: lastName, required: true },
        { field: email, required: true },
        { field: imgUrl, required: false },
    ]);

    checkLength(firstName, 2, 50);
    checkLength(lastName, 2, 100);
    checkUrl(imgUrl);
    checkEmail(email);
    checkDuplicateEmail(email, allStudents);

    let allValid = true;

    const entries = [...form.querySelectorAll("div")];
    entries.forEach((entry) => {
        if ([...entry.classList].includes("error")) {
            allValid = false;
        }
        console.log(entry);
    });

    return allValid;
}

function resetStudentFormStyles() {
    const smalls = document.getElementsByTagName("small");
    [...smalls].forEach((small) => (small.innerText = ""));

    const formControls = document.querySelectorAll(".attn");
    formControls.forEach((div) => (div.className = "form-control attn"));
}

export default studentFormValidator;

export { resetStudentFormStyles };
