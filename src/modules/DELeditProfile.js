(function() {
    const editButton = document.querySelector('.user-info__edit');
    const popup = document.querySelector('.popup_type_edit_profile');
    const popupCloseButton = popup.querySelector('.popup__close');
    const editUserForm = popup.querySelector('.popup__form');
    const newUserName = popup.querySelector('.popup__input_type_user-name');
    const newUserAbout = popup.querySelector('.popup__input_type_about');
    const userNameElement = document.querySelector('.user-info__name');
    const userAboutElement = document.querySelector('.user-info__job');
    const submitButton = popup.querySelector('.popup__button');
    
    const modal = new Popup(popup);
    const api = new Api(GROUP, BASE_URL, TOKEN);

    function handleOpenModal() {
        newUserName.value = userNameElement.textContent;
        newUserAbout.value = userAboutElement.textContent;

        modal.open();
    }

    function handleSaveUserInfo(event) {
        event.preventDefault();

        submitButton.textContent = 'Загрузка...';

        api.editUserInfo(newUserName.value, newUserAbout.value)
            .then(result => {
                const { name, about } = result;

                userNameElement.textContent = name;
                userAboutElement.textContent = about;
        
                editUserForm.reset();
        
                modal.close();
            })
            .finally(() => {
                submitButton.textContent = 'Сохранить';
            });
    }

    function hadleInput(event) {
        checkFormValidness(editUserForm, submitButton);
        validateInput(event.target);
    }

    newUserName.addEventListener('input', hadleInput);
    newUserAbout.addEventListener('input', hadleInput);
    editButton.addEventListener('click', handleOpenModal);
    popupCloseButton.addEventListener('click', modal.close.bind(modal));
    editUserForm.addEventListener('submit', handleSaveUserInfo);
})();
