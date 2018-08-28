export const EventTypes = {
  SET_API_KEY: 'auth.setApiKey',
  SET_ACCESS_TOKEN: 'auth.setAccessToken'
};

export default class Events {
  constructor() {
    this._events = {};
  }

  emit(eventName, data) {
    const event = this._events[eventName];
    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }

  subscribe(eventName, fn) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }

    this._events[eventName].push(fn);
    return () => {
      this._events[eventName] = this._events[eventName].filter(eventFn => fn !== eventFn);
    };
  }

  clear(eventName) {
    delete this._events[eventName];
  }

  once(eventName, listener) {
    this.subscribe(eventName, function f() {
      this.clear(eventName);
      listener.apply(this, arguments);
    });
  }
}
