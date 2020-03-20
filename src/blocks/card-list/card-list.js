import { BaseComponent } from '../base-component/base-component';
import { RENDER_CARDS_STEP } from '../../js/constants/numbers';
import { EMPTY_RESPONSE } from '../../js/constants/texts';

export class NewsCardList extends BaseComponent {
    constructor({ listContainerElement, cards, showAll }) {
        super();

        this._listContainerElement = listContainerElement;
        this._foundFieldElement = listContainerElement.querySelector('.search-result__found-field');
        this._listElement = listContainerElement.querySelector('.card-list');
        this._showMoreBtnElement = listContainerElement.querySelector('.search-result__show-more-btn');
        this._loaderElement = listContainerElement.querySelector('.search-result__searching-field');
        this._errorContainerElement = listContainerElement.querySelector('.search-result__empty-res-field');
        this._errorMessageElement = listContainerElement.querySelector('.search-result__empty-res-text');
        this._cards = cards;
        this._showAll = showAll;
        this._showingCardsCount = 0;

        this._cards.forEach(card => this._addCard(card));
        this._setHandlers([{ handlerFunction: this._handleShowMore, name: '_handleShowMore' }]);
        this._setListeners();
    }

    renderResults(cards) {
        this._cards = cards;
        this.hideError();

        if (cards.length > 0) {
            this._showFoundField();
            this._handleShowMore();
            this._showShowMoreButton();
        } else {
            this.renderError(EMPTY_RESPONSE);
        }
    }

    hideResults() {
        this._listContainerElement.classList.add('page__element_hidden');
        this._removeListeners();
    }

    renderLoader() {
        if (this._loaderElement) {
            this._listContainerElement.classList.remove('page__element_hidden');
            this._loaderElement.classList.remove('page__element_hidden');
            this.hideError();
        }
    }

    hideLoader() {
        if (this._loaderElement) {
            this._loaderElement.classList.add('page__element_hidden');
        }
    }

    renderError(error) {
        if (this._errorContainerElement) {
            this._listContainerElement.classList.remove('page__element_hidden');
            this._errorContainerElement.classList.remove('page__element_hidden');
            this._errorMessageElement.textContent = error;
        }
    }

    hideError() {
        if (this._errorContainerElement) {
            this._errorContainerElement.classList.add('page__element_hidden');
        }
    }

    clearList() {
        while (this._listElement.firstChild) {
            this._listElement.removeChild(this._listElement.firstChild);
        }
        this._hideFoundField();
    }

    _showFoundField() {
        if (this._foundFieldElement) {
            this._foundFieldElement.classList.remove('page__element_hidden');
        }
    }

    _hideFoundField() {
        if (this._foundFieldElement) {
            this._foundFieldElement.classList.add('page__element_hidden');
        }
    }

    _handleShowMore() {
        const currentCountWithStep = this._showingCardsCount + RENDER_CARDS_STEP;
        const nextCardsCount = this._showAll ? this._cards.length : Math.min(currentCountWithStep, this._cards.length);
        const printingCards = this._cards.slice(this._showingCardsCount, nextCardsCount);
        printingCards.forEach(card => this._addCard(card));
        this._showingCardsCount = nextCardsCount;

        if (this._cards.length <= this._showingCardsCount) {
            this._hideShowMoreButton();
        }
    }

    _hideShowMoreButton() {
        if (this._showMoreBtnElement) {
            this._showMoreBtnElement.classList.add('page__element_hidden');
        }
    }

    _showShowMoreButton() {
        if (this._showMoreBtnElement) {
            this._showMoreBtnElement.classList.remove('page__element_hidden');
        }
    }

    _addCard(card) {
        this._listElement.appendChild(card);
    }

    _setListeners() {
        if (this._showMoreBtnElement) {
            this._showMoreBtnElement.addEventListener('click', this._handleShowMore);
        }
    }

    _removeListeners() {
        if (this._showMoreBtnElement) {
            this._showMoreBtnElement.addEventListener('click', this._handleShowMore);
        }
    }
}
