(function() {
    const list = document.querySelector('.places-list');
    const popup = document.querySelector('.popup_type_image');
    const popupImage = document.querySelector('.popup__image');
    const popupCloseButton = popup.querySelector('.popup__image-close');

    function openImageModal(clickedElement) {
        popup.classList.add('popup_is-opened');
        const { backgroundImage } = clickedElement.style;
        const url = backgroundImage.slice(5, backgroundImage.length - 2);
        popupImage.src = url;
    }

    function closeImageModal() {
        popup.classList.remove('popup_is-opened');
        popupImage.style.backGroundImage = '';
    }

    function handleClickList(event) {
        const clickedElement = event.target;

        if (clickedElement.classList.contains('place-card__delete-icon')) {
            return;
        } else if (clickedElement.classList.contains('place-card__image')) {
            openImageModal(clickedElement);
        }
    }

    popupCloseButton.addEventListener('click', closeImageModal);
    list.addEventListener('click', handleClickList);
})();
