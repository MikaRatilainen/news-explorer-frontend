export class MainApi {
    constructor({ baseUrl, token }) {
        this._baseUrl = baseUrl;
        this._token = token;
    }

    signup(userInfo) {
        const requestConfig = { path: '/signup' };

        return this._commonPostRequest(userInfo, requestConfig);
    }

    signin(userInfo) {
        const requestConfig = { path: '/signin' };

        return this._commonPostRequest(userInfo, requestConfig);
    }

    getUserInfo(token) {
        this._token = token;
        const requestConfig = { path: '/users/me' };

        return this._commonRequest(requestConfig);
    }

    getArticles(token) {
        this._token = token;
        const requestConfig = { path: '/articles' };

        return this._commonRequest(requestConfig);
    }

    createArticle(cardData, token) {
        this._token = token;
        const requestConfig = { path: '/articles' };

        return this._commonPostRequest(cardData, requestConfig);
    }

    removeArticle(id, token) {
        this._token = token;
        const requestConfig = {
            method: 'DELETE',
            path: `/articles/${id}`,
        };

        return this._commonRequest(requestConfig);
    }

    _commonPostRequest(body, requestConfig) {
        const postRequestConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            ...requestConfig,
        };

        return this._commonRequest(postRequestConfig);
    }

    _commonRequest({ path, method = 'GET', headers = {}, body }) {
        return fetch(`${this._baseUrl}${path}`, {
            method,
            headers: {
                authorization: this._token,
                ...headers,
            },
            body,
        })
            .then(res =>  {
                return this._checkRequest(res);
            });
    }

    _checkRequest(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
    }
}
