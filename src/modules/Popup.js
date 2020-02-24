import { resetForm } from '../services/validateService';

export class Popup {
    constructor(popup) {
        this.popup = popup;
    }

    open() {
        const submitButton = this.popup.querySelector('.popup__button');
        submitButton.disabled = true;

        this.popup.classList.add('popup_is-opened');
    }

    close() {
        this.popup.classList.remove('popup_is-opened');

        const newCardForm = this.popup.querySelector('.popup__form');
        resetForm(newCardForm);
    }
}