export class NewsApi {
    constructor({ baseUrl, apiKey }) {
        this._baseUrl = baseUrl;
        this._apiKey = apiKey;
    }

    getNewsByKeyWord({ keyWord, from, to, pageSize }) {
        const requestPath = '/everything';
        const params = `?q=${keyWord}&apiKey=${this._apiKey}&from=${from}&to=${to}&pageSize=${pageSize}`;
        const path = requestPath + params;

        return fetch(`${this._baseUrl}${path}`)
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
