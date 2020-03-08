import { BaseComponent } from '../BaseComponent';
import { popupTemplate } from './template';

export class Popup extends BaseComponent {
    constructor({ container, handlers }) {
        super();

        this._popupElement = this._initPopup(container);
        this._contentElement = this._popupElement.querySelector('.popup__inner-content');
        this._layoutElement = this._popupElement.querySelector('.popup__layout');
        this._closeBtnElement = this._popupElement.querySelector('.popup__close');

        this._setHandlers([{ handlerFunction: this.close, name: 'close' }]);
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

    _initPopup(container) {
        container.insertAdjacentHTML('beforeend', popupTemplate);
        const element = container.querySelector('.popup');
        element.classList.add('page__element_hidden');

        return element;
    }

    _setListeners() {
        this._layoutElement.addEventListener('click', this.close);
        this._closeBtnElement.addEventListener('click', this.close);
    }

    _removeListeners() {
        this._layoutElement.removeEventListener('click', this.close);
        this._closeBtnElement.removeEventListener('click', this.close);
    }
}
