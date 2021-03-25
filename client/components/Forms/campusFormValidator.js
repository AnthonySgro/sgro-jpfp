function campusFormValidator() {
    const form = document.getElementById("form");
    const btn = document.getElementById("submit-btn-form");
    const name = document.getElementById("campus-name-input");
    const address = document.getElementById("campus-address-input");
    const description = document.getElementById("campus-description-input");
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

    checkRequired([
        { field: name, required: true },
        { field: address, required: true },
        { field: description, required: false },
        { field: imgUrl, required: false },
    ]);

    checkLength(name, 2, 50);
    checkLength(address, 2, 100);
    checkUrl(imgUrl);

    let allValid = true;

    const entries = [...form.querySelectorAll("div")];
    entries.forEach((entry) => {
        if ([...entry.classList].includes("error")) {
            allValid = false;
        }
    });

    return allValid;
}

function resetCampusFormStyles() {
    const smalls = document.getElementsByTagName("small");
    [...smalls].forEach((small) => (small.innerText = ""));

    const formControls = document.querySelectorAll(".attn");
    formControls.forEach((div) => (div.className = "form-control attn"));
}

export default campusFormValidator;

export { resetCampusFormStyles };
