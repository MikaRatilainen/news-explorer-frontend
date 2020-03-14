import { BaseComponent } from '../BaseComponent';

export class Form extends BaseComponent {
    constructor({ formElement, handleSubmit }) {
        super();

        this._formElement = formElement;
        this._errorElement = formElement.querySelector('.form__error');
        this._submitButton = formElement.querySelector('button[type=submit]');
        const inputs = formElement.querySelectorAll('input');
        this._inputElements = Array.from(inputs);
        this._handleSubmit = handleSubmit;

        super._setHandlers([
            { handlerFunction: this._validateForm, name: '_validateForm' },
            { handlerFunction: this._submitForm, name: '_submitForm' },
        ]);
        this._setListeners();
    }

    setServerError(err) {
        this._errorElement.classList.remove('page__element_hidden');
    }

    removeListeners() {
        this._inputElements.forEach(input => {
            input.removeEventListener('input', this._validateForm);
        });
        this._formElement.removeEventListener('submit', this._submitForm);
    }

    disableSubmit() {
        this._submitButton.disabled = true;
    }

    enableSubmit() {
        this._submitButton.disabled = false;
    }

    _submitForm(event) {
        event.preventDefault();
        const formValues = this._getInfo();

        this._handleSubmit(formValues, this);
    }

    _validateForm() {
        const isValid = this._inputElements.every(inputElem => inputElem.validity.valid);

        this._submitButton.disabled = !isValid;
    }

    _getInfo() {
        return this._inputElements.reduce((acc, { name, value }) => {
            return { ...acc, [name]: value };
        }, {});
    }

    _setListeners() {
        this._inputElements.forEach(input => {
            input.addEventListener('input', this._validateForm);
        });
        this._formElement.addEventListener('submit', this._submitForm);
    }
}
