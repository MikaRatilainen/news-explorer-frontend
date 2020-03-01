(function() {
    const listElement = document.querySelector('.places-list');
    const addButton = document.querySelector('.user-info__button');
    const popup = document.querySelector('.popup_type_add-card');
    const popupCloseButton = popup.querySelector('.popup__close');
    const newCardForm = popup.querySelector('.popup__form');
    const newCardName = popup.querySelector('.popup__input_type_name');
    const newCardLink = popup.querySelector('.popup__input_type_link-url');
    const submitButton = popup.querySelector('.popup__button');
    
    const modal = new Popup(popup);
    const api = new Api(GROUP, BASE_URL, TOKEN);

    let cardList = [];
    setInitialCards();

    function setInitialCards() {
        api.getInitialCards()
            .then(result => {
                cardList = new CardList(listElement, result);
            });
    }

    function hadleInput(event) {
        checkFormValidness(newCardForm, submitButton);
        validateInput(event.target);
    }

    function handleAddCard(event) {
        event.preventDefault();

        submitButton.textContent = 'Загрузка...';

        api.addCard(newCardName.value, newCardLink.value)
            .then(result => {
                newCardForm.reset();
            
                cardList.addCard(result);

                modal.close();
            })
            .finally(() => {
                submitButton.textContent = 'Сохранить';
            });
    }

    newCardName.addEventListener('input', hadleInput);
    newCardLink.addEventListener('input', hadleInput);
    addButton.addEventListener('click', modal.open.bind(modal));
    popupCloseButton.addEventListener('click', modal.close.bind(modal));
    newCardForm.addEventListener('submit', handleAddCard);
})();
