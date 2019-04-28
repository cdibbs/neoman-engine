import * as Rx from 'rxjs';
var bob = "hello";
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.subjects = {};
    }
    EventEmitter.prototype.emit = function (type, data) {
        this.subjects[type] || (this.subjects[type] = new Rx.Subject());
        this.subjects[type].next(data);
    };
    EventEmitter.prototype.on = function (type, fn) {
        this.subjects[type] || (this.subjects[type] = new Rx.Subject());
        return this.subjects[type].subscribe(fn);
    };
    return EventEmitter;
}());
export { EventEmitter };
//# sourceMappingURL=event-emitter.js.map