export class BaseComponent {
    _setHandlers(handlers) {
        handlers.forEach(handler => {
            const { handlerFunction, name } = handler;
            this[name] = handlerFunction.bind(this);
        });
    }
}
