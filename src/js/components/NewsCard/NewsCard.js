import { BaseComponent } from '../BaseComponent';
import { cardTemplate } from './template';
import { cardStatuses } from '../../constants/configs';
import { IMAGE_LOAD_ERROR, LOGIN_MESSAGE, DELETE_MASSAGE } from '../../constants/texts';

export class NewsCard extends BaseComponent {
    constructor({ cardData, cardStatus, handlers }) {
        super();

        this._cardData = cardData;
        this._cardStatus = cardStatus;
        this._handlers = handlers;

        this.element = this._initCardElement();
        this._markButton = this.element.querySelector('.card__control');
        this._markIcon = this.element.querySelector('.card__mark-icon');
        this._markMessage = this.element.querySelector('.card__delete-message');

        this._setImage();
        this._setDate();
        this._setTitle();
        this._setText();
        this._setSource();
        this._setMarkMessage();
        this._setKeyWord();

        this._setHandlers([{ f: this._handleClickMarkButton, name: '_handleClickMarkButton' }]);
        this._setListeners();

        return this;
    }

    getCardData() {
        return this._cardData;
    }

    setCardActive(id) {
        this._cardData._id = id;
        this._markIcon.classList.add('card__mark-icon_active');
        this._cardStatus = cardStatuses.active;
    }

    setCardInactive() {
        this._markIcon.classList.remove('card__mark-icon_active');
        this._cardStatus = cardStatuses.inactive;
    }

    changeCardStatus(status) {
        this._cardStatus = status;
        this._setMarkMessage();
    }

    _initCardElement() {
        const element = document.createElement('article');
        element.classList.add('card');
        element.insertAdjacentHTML('beforeend', cardTemplate);

        return element;
    }

    _setImage() {
        const { image } = this._cardData;
        const imageElement = this.element.querySelector('.card__image');

        if (image) {
            imageElement.src = image;
        } else {
            imageElement.alt = IMAGE_LOAD_ERROR;
        }
    }

    _setDate() {
        const { date } = this._cardData;
        const dateElement = this.element.querySelector('.card__date');
        dateElement.textContent = date;
    }

    _setTitle() {
        const { title } = this._cardData;
        const titleElement = this.element.querySelector('.card__title');
        titleElement.textContent = title;
    }

    _setText() {
        const { text } = this._cardData;
        const textElement = this.element.querySelector('.card__text');
        textElement.textContent = text;
    }

    _setSource() {
        const { source, link } = this._cardData;
        const sourceElement = this.element.querySelector('.card__source');
        sourceElement.textContent = source;
        sourceElement.href = link;
    }

    _setKeyWord() {
        if (cardStatuses[this._cardStatus] === cardStatuses.savedMode) {
            const { keyword } = this._cardData;
            const keywordElement = this.element.querySelector('.card__search-value');
            keywordElement.textContent = keyword;
            keywordElement.classList.remove('page__element_hidden');
        }
    }

    _setMarkMessage() {
        const currentStatus = cardStatuses[this._cardStatus];
        if (currentStatus === cardStatuses.disabled) {
            this._markMessage.textContent = LOGIN_MESSAGE;
            this._markMessage.classList.remove('page__element_hidden');
            this._markIcon.classList.add('card__mark-icon');
            this._markIcon.classList.remove('card__delete-icon');
        } else if (currentStatus === cardStatuses.savedMode) {
            this._markMessage.textContent = DELETE_MASSAGE;
            this._markMessage.classList.remove('page__element_hidden');
            this._markIcon.classList.add('card__delete-icon');
            this._markIcon.classList.remove('card__mark-icon');
        } else {
            this._markMessage.classList.add('page__element_hidden');
        }
    }

    _setListeners() {
        this._markButton.addEventListener('click', this._handleClickMarkButton);
    }

    _handleClickMarkButton() {
        const { handleSaveCard, handleDeleteCard } = this._handlers;
        const currentStatus = cardStatuses[this._cardStatus];
        if (currentStatus === cardStatuses.inactive) {
            handleSaveCard(this);
        } else if (currentStatus === cardStatuses.active || currentStatus === cardStatuses.savedMode) {
            handleDeleteCard(this);
        } else {
            return () => {};
        }
    }
}
