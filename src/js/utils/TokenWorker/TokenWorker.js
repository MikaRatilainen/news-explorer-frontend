export class TokenWorker {
    set(token) {
        localStorage.setItem('token', token);
    }

    get() {
        return localStorage.getItem('token');
    }

    remove() {
        return localStorage.removeItem('token');
    }
}
