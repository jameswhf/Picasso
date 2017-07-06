const util = require('./tool/util');

const defaultEventMap = {
    'touchstart': 'touchStart',
    'touchmove': 'touchMove',
    'touchend': 'touchEnd',
    'tap': 'tap',
    'longtap': 'longTap'
};

function packageEvent(event){
    return event;
}
const handlerMap = {
    'touchstart': function (e) {
        let event = packageEvent(e);
        this.trigger('touchstart', event);
    },
    'touchmove': function (e) {
        let event = packageEvent(e);
        this.trigger('touchmove', event);
    },
    'touchend': function (e) {
        let event = packageEvent(e);
        this.trigger('touchend', event);
    },
    'tap': function (e) {
        let event = packageEvent(e);
        this.trigger('tap', event);
    },
    'longtap': function (e) {
        let event = packageEvent(e);
        this.trigger('longtap', event);
    }
};

function EventHandler (picasso, shapeManager, page, eventMap = defaultEventMap) {
    this._page = page;
    this._picasso = picasso;
    this._shapeManager = shapeManager;
    const self = this;
    util.each(eventMap, function(originName, name){
        page[originName] = util.bind(handlerMap[name], self);
    });
};

EventHandler.prototype = {
    contructor: EventHandler,
    on: function (originName, func, context) {
        this._page[originName] = util.bind(func, context ? context : this);
    },
    trigger: function (eventName, event) {
        //根据event 找到对应可以响应的 shape
        var shapeList = this._shapeManager.shapeList;
        var len = shapeList.len;
        for (var pos = len - 1; pos >= 0; pos--) {
            var shape = shapeList[pos];
        }
    },
    dispatch: function (shape, eventName, event) {
    }
}

module.exports = EventHandler;