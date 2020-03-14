import { DateWorker } from '../DateWorker';

export class CardDataWorker {
    constructor() {
        this._dateWorker = new DateWorker();
    }

    mapCardData(cardsData, keyword) {
        return cardsData.map((card) => this._mapCard(card, keyword));
    }

    _mapCard(card, keyword) {
        const { title, description, publishedAt, source, url, urlToImage } = card;

        return {
            keyword,
            title,
            text: description,
            date: this._dateWorker.formatDateCard(publishedAt),
            source: source.name,
            link: url,
            image: urlToImage,
        };
    }
}
