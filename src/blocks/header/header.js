import { headerThemes } from '../../js/constants/themes';
import { AUTH_BUTTON_TEXT } from '../../js/constants/texts';

export class Header {
    constructor({ headerElement, handlers, theme, isLoggedIn, userName }) {
        this._headerElement = headerElement;
        this._authButtonElement = this._headerElement.querySelector('.icon-button');
        this._authButtonTextElement = this._authButtonElement.querySelector('.icon-button__text');

        this._setTheme(theme);
        this.render({ isLoggedIn, userName });

        this._setHandlers(handlers);
    }

    render({ isLoggedIn, userName }) {
        this._authButtonTextElement.textContent = isLoggedIn ? userName : AUTH_BUTTON_TEXT;

        if (isLoggedIn) {
            this._headerElement.classList.add('header_logged-in');
        } else {
            this._headerElement.classList.remove('header_logged-in');
        }
    }

    _setTheme(theme) {
        if (theme === headerThemes.black) {
            this._headerElement.classList.add('header_theme_black');
        }
    }

    _setHandlers({ handleClickAuthButton }) {
        this._authButtonElement.addEventListener('click', handleClickAuthButton);
    }
}
