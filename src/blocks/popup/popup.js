import { BaseComponent } from '../base-component/base-component';
import { popupTemplate } from './template';
import { ESCAPE_KEY, IE_ESCAPE_KEY } from "../../js/constants/texts";

export class Popup extends BaseComponent {
    constructor({ container }) {
        super();

        this._popupElement = this._initPopup(container);
        this._contentElement = this._popupElement.querySelector('.popup__inner-content');
        this._layoutElement = this._popupElement.querySelector('.popup__layout');
        this._closeBtnElement = this._popupElement.querySelector('.popup__close');

        this._setHandlers([
            { handlerFunction: this._handleClosePopup, name: '_handleClosePopup' },
            { handlerFunction: this._handleClickKey, name: '_handleClickKey' },
        ]);
    }

    open() {
        this._popupElement.classList.remove('page__element_hidden');
        this._setListeners();
    }

    close() {
        this._popupElement.classList.add('page__element_hidden');
        this._removeListeners();
    }

    setContent(content) {
        this._contentElement.append(content);
    }

    clearContent() {
        while (this._contentElement.firstChild) {
            this._contentElement.removeChild(this._contentElement.firstChild);
        }
    }

    _handleClosePopup() {
        this.close();
    }

    _handleClickKey(event) {
        if (event.key === IE_ESCAPE_KEY || event.key === ESCAPE_KEY) {
            this.close();
        }
    }

    _initPopup(container) {
        container.insertAdjacentHTML('beforeend', popupTemplate);
        const element = container.querySelector('.popup');
        element.classList.add('page__element_hidden');

        return element;
    }

    _setListeners() {
        this._layoutElement.addEventListener('click', this._handleClosePopup);
        this._closeBtnElement.addEventListener('click', this._handleClosePopup);
        document.addEventListener('keydown', this._handleClickKey);
    }

    _removeListeners() {
        this._layoutElement.removeEventListener('click', this._handleClosePopup);
        this._closeBtnElement.removeEventListener('click', this._handleClosePopup);
        document.removeEventListener('keydown', this._handleClickKey);
    }
}
