import { Card } from './Card';

export class CardList {
    constructor(list, initialCards, userId) {
        this.element = list;
        this.userId = userId;
        this.render(initialCards);
    }

    render(initialCards) {
        initialCards.forEach(this.addCard, this);
    }

    addCard(cardProps) {
        const { element } = new Card(cardProps, this.userId);

        this.element.appendChild(element);
    }
}
