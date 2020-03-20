export class ArticlesCounter {
    constructor({ counterElement }) {
        this._counterElement = counterElement;
        this._count = this._counterElement.querySelector('.saved-info__count');
        this._keywords = this._counterElement.querySelector('.saved-info__keyword');

        return this;
    }

    setCardsData(cardsData) {
        this._cardsData = cardsData;
        this._render();
    }

    setUserName(userName) {
        this._userName = userName;
        this._render();
    }

    _render() {
        if (this._cardsData && this._userName) {
            const articlesCount = this._cardsData.length;
            this._count.textContent = `${this._userName}, у вас ${articlesCount} сохранённых статей`;
            this._keywords.textContent = this._getKeywordsInfo(this._cardsData);
        }
    }

    _getKeywordsInfo(cardsData) {
        const calcKeywords = this._calculateKeywords(cardsData);
        const keywordsArr = Object.keys(calcKeywords);
        keywordsArr.sort((a, b) => calcKeywords[b] - calcKeywords[a]);

        let result = '';
        if (keywordsArr.length > 0) {
            result += keywordsArr[0];
        }
        if (keywordsArr.length > 1) {
            result += `, ${keywordsArr[1]}`;
        }
        if (keywordsArr.length > 2) {
            const restKeywordsCount = keywordsArr.length - 2;
            const correctSentenceForm = restKeywordsCount === 1 ? 'другому' : 'другим';
            result += ` и ${keywordsArr.length - 2} ${correctSentenceForm}`;
        }

        return result;
    }

    _calculateKeywords(cardsData) {
        return cardsData.reduce((acc, card) => {
            const keywordCount = acc[card.keyword] ? acc[card.keyword] + 1 : 1;

            return { ...acc, [card.keyword]: keywordCount };
        }, {});
    }
}
