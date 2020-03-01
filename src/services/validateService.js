const REQUIRED_MESSAGE = 'Это обязательное поле';
const LENGTH_MESSAGE = 'Должно быть от 2 до 30 символов';
const URL_MESSAGE = 'Здесь должна быть ссылка';
const URL = 'url';

export function checkFormValidness(form, submitButton) {
    const isNotValid = Array.from(form.elements).some(inputElem => {
        return !inputElem.validity.valid;
    });

    submitButton.disabled = isNotValid;
}

export function validateInput(inputElem) {
    if (inputElem.type === URL) {
        return validateLinkField(inputElem);
    }

    return validateTextField(inputElem);
}

function validateTextField(inputElem) {
    if (inputElem.validity.valueMissing) {
        showMessage(inputElem, REQUIRED_MESSAGE);

        return false;
    }

    if (inputElem.validity.tooShort || inputElem.validity.tooLong) {
        showMessage(inputElem, LENGTH_MESSAGE);

        return false;
    }
    
    showMessage(inputElem, '');

    return true;
}

function validateLinkField(inputElem) {
    if (inputElem.validity.valueMissing) {
        showMessage(inputElem, REQUIRED_MESSAGE);

        return false;
    }

    if (inputElem.validity.typeMismatch) {
        showMessage(inputElem, URL_MESSAGE);

        return false;
    }
    
    showMessage(inputElem, '');

    return true;
}

function showMessage(inputElem, text) {
    const messageElem = inputElem.parentNode.querySelector('.popup__error-message');
    messageElem.textContent = text;
}

export function resetForm(form) {
    Array.from(form.elements).forEach(inputElem => {
        if (inputElem.type !== 'button') {
            inputElem.value = '';
            showMessage(inputElem, '');
        }
    });
}
