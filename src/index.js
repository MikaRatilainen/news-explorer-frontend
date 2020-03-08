import { MainApi } from './js/api/MainApi';
import { NewsApi } from './js/api/NewsApi';
import { Header } from './js/components/Header';
import { Popup } from './js/components/Popup';
import { NewsCardList } from './js/components/NewsCardList';
import { NewsCard } from './js/components/NewsCard';
import { Form } from './js/components/Form';
import { TokenWorker } from './js/utils/TokenWorker';
import { DateWorker } from './js/utils/DateWorker';
import { CardDataWorker } from './js/utils/CardDataWorker';
import { headerThemes } from './js/constants/themes';
import { cardStatuses } from './js/constants/configs';
import { SERVER_ERROR, EMPTY_REQUEST } from './js/constants/texts';
import { BASE_URL, NEWS_API_BASE_URL, NEWS_API_KEY, NEWS_API_PAGE_SIZE } from './js/constants/api';
import './pages/index.css';

const root = document.querySelector('.root');
const headerElement = root.querySelector('.header');
const resultsElement = root.querySelector('.search-result');

const tokenWorker = new TokenWorker();
const dateWorker = new DateWorker();
const cardDataWorker = new CardDataWorker();
const mainApi = new MainApi({ baseUrl: BASE_URL });
const newsApi = new NewsApi({ baseUrl: NEWS_API_BASE_URL, apiKey: NEWS_API_KEY });
const popup = new Popup({ container: root, handlers: {} });
const newsCardList = new NewsCardList({ listContainerElement: resultsElement, cards: [] });


// HEADER LOGIC
const headerHandlers = {
    clickAuthButton: handleClickAuth,
};
const headerParams = {
    headerElement,
    handlers: headerHandlers,
    theme: headerThemes.transparent,
    isLoggedIn: false,
};
const header = new Header(headerParams);

{
    const token = tokenWorker.get();
    if (token) {
        mainApi.getUserInfo(token)
            .then(res => {
                header.render({ userName: res.data.name, isLoggedIn: true});
            })
            .catch(err => {
                console.log(err);
            });
    }
}

function handleClickAuth() {
    const token = tokenWorker.get();

    if (token) {
        tokenWorker.remove();
        header.render({ isLoggedIn: false});
        newsCardList.clearList();
        newsCardList.hideResults();
    } else {
        openLoginPopup();
    }
}


// SEARCH LOGIC
const searchFormElement = document.querySelector('.search__controls');
new Form({ formElement: searchFormElement, handleSubmit: handleSearch });
const cardHandlers = { handleSaveCard, handleDeleteCard };
let cards = [];


function handleSearch(formValues) {
    const { searchValue } = formValues;

    if (searchValue === '') {
        newsCardList.renderError(EMPTY_REQUEST);
    } else {
        newsCardList.clearList();
        newsCardList.renderLoader();
        const today = dateWorker.formatDateForNewsApi(dateWorker.getTodayDate());
        const weekAgo = dateWorker.formatDateForNewsApi(dateWorker.getWeekAgoDate());
        const token = tokenWorker.get();

        newsApi.getNewsByKeyWord({ keyWord: searchValue, from: weekAgo, to: today, pageSize: NEWS_API_PAGE_SIZE })
            .then(res => {
                if (res.status === 'ok') {
                    const mappedCardData = cardDataWorker.mapCardData(res.articles, searchValue);
                    const cardStatus = token ? cardStatuses.inactive : cardStatuses.disabled;
                    const handlers = cardHandlers;
                    cards = mappedCardData.map(cardData =>  new NewsCard({ cardData, cardStatus, handlers }));
                    const cardElements = cards.map(card => card.element);
                    newsCardList.hideLoader();
                    newsCardList.renderResults(cardElements);
                } else {
                    return Promise.reject(SERVER_ERROR);
                }
            })
            .catch(() => {
                newsCardList.hideLoader();
                newsCardList.renderError(SERVER_ERROR);
            });
    }
}

function handleSaveCard(card) {
    const token = tokenWorker.get();
    const cardData = card.getCardData();
    mainApi.createArticle(cardData, token)
        .then(res => {
            card.setCardActive(res.data._id);
        })
        .catch(err => {
            console.log(err);
        });
}

function handleDeleteCard(card) {
    const token = tokenWorker.get();
    const cardData = card.getCardData();
    mainApi.removeArticle(cardData._id, token)
        .then(() => {
            card.setCardInactive();
        })
        .catch(err => {
            console.log(err);
        });
}


// LOGIN POPUP LOGIC
function openLoginPopup() {
    const loginPopupContent = getElementByTemplateId('login-popup');
    const loginFormElement = loginPopupContent.querySelector('.login-form');
    const registerButton = loginPopupContent.querySelector('.page__text-button');

    new Form({ formElement: loginFormElement, handleSubmit: handleLogin });

    popup.clearContent();
    popup.setContent(loginPopupContent);
    popup.open();

    registerButton.addEventListener('click', handleClickRegisterButton);
}

function handleClickRegisterButton(event) {
    event.target.removeEventListener('click', handleClickRegisterButton);

    popup.close();
    openRegisterPopup();
}

function handleLogin(formValues, form) {
    mainApi.signin(formValues)
        .then(res => {
            form.removeListeners();
            popup.clearContent();
            popup.close();

            const { data } = res;
            tokenWorker.set(data);
            mainApi.getUserInfo(data)
                .then(res => {
                    header.render({ userName: res.data.name, isLoggedIn: true});
                    if (cards.length > 0) {
                        cards.forEach(card => {
                            card.changeCardStatus(cardStatuses.inactive)
                        });
                        const cardElements = cards.map(card => card.element);
                        newsCardList.clearList();
                        newsCardList.renderResults(cardElements);
                    }
                })
                .catch(err => {
                    form.setServerError(err);
                });
        })
        .catch(err => {
            form.setServerError(err);
        });
}


// REGISTER POPUP LOGIC
function openRegisterPopup() {
    const registerPopupContent = getElementByTemplateId('register-popup');
    const registerFormElement = registerPopupContent.querySelector('.register-form');
    const loginButton = registerPopupContent.querySelector('.page__text-button');

    new Form({ formElement: registerFormElement, handleSubmit: handleRegister });

    popup.clearContent();
    popup.setContent(registerPopupContent);
    popup.open();

    loginButton.addEventListener('click', handleClickLoginButton);
}

function handleClickLoginButton(event) {
    event.target.removeEventListener('click', handleClickLoginButton);

    popup.close();
    openLoginPopup();
}

function handleRegister(formValues, form) {
    mainApi.signup(formValues)
        .then(() => {
            form.removeListeners();
            popup.clearContent();
            popup.close();
            openRegisteredPopup();
        })
        .catch(() => {
            form.setServerError();
        });
}


// REGISTERED POPUP LOGIC
function openRegisteredPopup() {
    const registeredPopupContent = getElementByTemplateId('register-success-popup');
    const loginButton = registeredPopupContent.querySelector('.page__text-button');

    popup.setContent(registeredPopupContent);
    popup.open();

    loginButton.addEventListener('click', handleClickLoginButton);
}


// UTILS
function getElementByTemplateId(id) {
    const template = document.getElementById(id);
    return template.content.cloneNode(true);
}
