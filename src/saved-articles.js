import { MainApi } from './js/api/MainApi';
import { Header } from './blocks/header/header';
import { NewsCardList } from './blocks/card-list/card-list';
import { NewsCard } from './blocks/card/card';
import { ArticlesCounter } from './blocks/saved-articles/saved-articles';
import { TokenWorker } from './js/utils/TokenWorker';
import { headerThemes } from './js/constants/themes';
import { cardStatuses } from './js/constants/configs';
import { BASE_URL } from './js/constants/api';
import './pages/saved-articles.css';

const root = document.querySelector('.root');
const headerElement = root.querySelector('.header');
const resultsElement = root.querySelector('.saved-articles');
const infoElement = root.querySelector('.saved-info');

const tokenWorker = new TokenWorker();
const mainApi = new MainApi({ baseUrl: BASE_URL });
const newsCardList = new NewsCardList({ listContainerElement: resultsElement, cards: [], showAll: true });


// HEADER LOGIC
const headerHandlers = {
    handleClickAuthButton: handleClickAuth,
};
const headerParams = {
    headerElement,
    handlers: headerHandlers,
    theme: headerThemes.black,
    isLoggedIn: false,
};
const header = new Header(headerParams);

{
    const token = tokenWorker.get();
    if (token) {
        mainApi.getUserInfo(token)
            .then(res => {
                header.render({ userName: res.data.name, isLoggedIn: true});
                articlesCounter.setUserName(res.data.name);
            })
            .catch(() => {
                window.location.href = '/';
            });
    } else {
        window.location.href = '/';
    }
}

function handleClickAuth() {
    tokenWorker.remove();
    window.location.href = '/';
}


// ARTICLES COUNTER
const articlesCounter = new ArticlesCounter({ counterElement: infoElement });


// CARDLIST LOGIC
const token = tokenWorker.get();
let cardsData = [];
let cards = [];
const handlers = { handleDeleteCard };

mainApi.getArticles(token)
    .then(res => {
        const cardStatus = cardStatuses.savedMode;
        cardsData = res.data;
        cards = cardsData.map(cardData =>  new NewsCard({ cardData, cardStatus, handlers }));
        const cardElements = cards.map(card => card.element);
        newsCardList.renderResults(cardElements);
        articlesCounter.setCardsData(cardsData);
    })
    .catch(err => {
        console.log(err);
    });

function handleDeleteCard(card) {
    card.setCardIsUpdating(true);
    const token = tokenWorker.get();
    const cardData = card.getCardData();
    mainApi.removeArticle(cardData._id, token)
        .then(() => {
            const deletedId = card._cardData._id;
            card.element.remove();
            cardsData = cardsData.filter(card => card._id !== deletedId);
            articlesCounter.setCardsData(cardsData);
        })
        .catch(err => {
            console.log(err);
        });
}
