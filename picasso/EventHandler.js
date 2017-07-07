const util = require('./tool/util');

const defaultEventMap = {
    'touchstart': 'touchStart',
    'touchmove': 'touchMove',
    'touchend': 'touchEnd',
    'tap': 'tap',
    'longtap': 'longTap'
};

function packageEvent(event){
    var touch = event.touches[0];
    //根据event 找到对应可以响应的 shape
    var shapeList = this._shapeManager.shapeList;
    var len = shapeList.len;
    for (var pos = len - 1; pos >= 0; pos--) {
        var shape = shapeList[pos];
        if (shape.canRespondTouch(touch)) {
            return {target: shape, touch: touch};
        }
    }
    return {target: this._picasso, touch: touch};
}

const handlerMap = {
    'touchstart': function (e) {
        let event = packageEvent.apply(this, [e]);
        this._touchTarget = event.target;
        if (this._touchTarget.trigger) {
            this._touchTarget.trigger('touchstart', event);
        }
    },
    'touchmove': function (e) {
        var currentTouchTarget = this._touchTarget;
        if (currentTouchTarget && currentTouchTarget.trigger) {
            currentTouchTarget.trigger('touchmove', {target: this._touchTarget, touch: e.touches[0]});
        }
    },
    'touchend': function (e) {
        var currentTouchTarget = this._touchTarget;
        if (currentTouchTarget && currentTouchTarget.trigger) {
            currentTouchTarget.trigger('touchend', {target: this._touchTarget, touch: e.touches[0]});
        }
        this._touchTarget = null;
    },
    'tap': function (e) {
        let event = packageEvent.apply(this, [e]);
        event.target.trigger && event.target.trigger('tap', event);
    },
    'longtap': function (e) {
        let event = packageEvent.apply(this, [e]);
        event.target.trigger && event.target.trigger('longtap', event);
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
    }
}

module.exports = EventHandler;