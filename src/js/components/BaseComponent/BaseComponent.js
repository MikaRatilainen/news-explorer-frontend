export class BaseComponent {
    _setHandlers(handlers) {
        handlers.forEach(handler => {
            this[handler.name] = handler.f.bind(this);
        });
    }
}
