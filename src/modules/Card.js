import { Api, SERVER_URL, GROUP, TOKEN } from './Api';

export class Card {
    constructor({ name, link, likes, _id, owner }, userId) {
        this._id = _id;
        this.name = name;
        this.link = link;
        this.likes = likes;
        this.owner= owner;
        this.userId = userId;
        this.isUserLiked = this.getIsUserLiked();
        this.api = new Api(GROUP, SERVER_URL, TOKEN);

        this.removeHandler = this.remove.bind(this);
        this.likeHandler = this.toggleLike.bind(this);

        this.element = this.create();
    }

    create() {
        const card = document.createElement('div');
        card.classList.add('place-card');

        card.appendChild(this.createImage());
        card.appendChild(this.createDescription());

        return card;
    }

    createImage() {
        const image = document.createElement('div');
        image.classList.add('place-card__image');
        image.style.backgroundImage = `url(${this.link})`;
        
        if (this.userId === this.owner._id) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('place-card__delete-icon');
            deleteButton.addEventListener('click', this.removeHandler);

            image.appendChild(deleteButton);
        }

        return image;
    }

    createDescription() {
        const description = document.createElement('div');
        description.classList.add('place-card__description');
        
        const title = document.createElement('h3');
        title.classList.add('place-card__name');
        title.textContent = this.name;

        const likeContainer = document.createElement('div');
        likeContainer.classList.add('place-card__like-container');

        const likeButton = document.createElement('button');
        likeButton.classList.add('place-card__like-icon');
        if (this.isUserLiked) {
            likeButton.classList.add('place-card__like-icon_liked');
        }
        likeButton.addEventListener('click', this.likeHandler);
        likeContainer.appendChild(likeButton);

        const likeCount = document.createElement('p');
        likeCount.classList.add('place-card__like-count');
        likeCount.textContent = this.likes.length;
        likeContainer.appendChild(likeCount);

        description.appendChild(title);
        description.appendChild(likeContainer);

        return description;
    }

    getIsUserLiked() {
        return this.likes.some(user => this.userId === user._id);
    }

    toggleLike() {
        const likeButton = this.element.querySelector('.place-card__like-icon');

        if (this.isUserLiked) {
            this.api.dislikeCard(this._id)
                .then(result => {
                    likeButton.classList.remove('place-card__like-icon_liked');
                    this.updateLikeInfo(result.likes);
                });
        } else {
            this.api.likeCard(this._id)
                .then(result => {
                    likeButton.classList.add('place-card__like-icon_liked');
                    this.updateLikeInfo(result.likes);
                });
        }
    }

    updateLikeInfo(likes) {
        this.likes = likes;
        const likesCount = this.element.querySelector('.place-card__like-count');
        likesCount.textContent = likes.length;
        this.isUserLiked = this.getIsUserLiked();
    }

    remove() {
        const confirmed = confirm('Вы действительно хотите удалить карточку?');

        if (!confirmed) {
            return;
        }

        this.api.deleteCard(this._id)
            .then(result => {
                const deleteButton = this.element.querySelector('.place-card__delete-icon');
                const likeButton = this.element.querySelector('.place-card__like-icon');
        
                deleteButton.removeEventListener('click', this.removeHandler);
                likeButton.removeEventListener('click', this.likeHandler);

                this.element.remove();
            });
    }
}
