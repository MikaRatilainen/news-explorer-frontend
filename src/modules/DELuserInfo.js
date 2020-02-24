let userId = null;

(function() {
    const nameElement = document.querySelector('.user-info__name');
    const aboutElement = document.querySelector('.user-info__job');
    const avatarElement = document.querySelector('.user-info__photo');
    const popup = document.querySelector('.popup_type_change-avatar');
    const popupCloseButton = popup.querySelector('.popup__close');
    const avatarForm = popup.querySelector('.popup__form');
    const avatarLink = popup.querySelector('.popup__input_type_link-url');
    const submitButton = popup.querySelector('.popup__button');
    
    const modal = new Popup(popup);

    const api = new Api(GROUP, BASE_URL, TOKEN);
    api.getUserInfo()
        .then(result => {
            const { name, about, avatar, _id } = result;

            nameElement.textContent = name;
            aboutElement.textContent = about;
            avatarElement.style.backgroundImage = `url(${avatar})`;

            userId = _id;
        });

    function handleChangeAvatar(event) {
        event.preventDefault();

        submitButton.textContent = 'Загрузка...';

        api.changeAvatar(avatarLink.value)
            .then(result => {
                avatarForm.reset();

                avatarElement.style.backgroundImage = `url(${result.avatar})`;

                modal.close();
            })
            .finally(() => {
                submitButton.textContent = 'Сохранить';
            });
    }

    function hadleInput(event) {
        checkFormValidness(avatarForm, submitButton);
        validateInput(event.target);
    }

    avatarLink.addEventListener('input', hadleInput);
    avatarElement.addEventListener('click', modal.open.bind(modal));
    popupCloseButton.addEventListener('click', modal.close.bind(modal));
    avatarForm.addEventListener('submit', handleChangeAvatar);
})();
