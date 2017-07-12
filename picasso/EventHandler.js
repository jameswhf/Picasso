const util = require('./tool/util');

const wxEventMap = {
    'touchstart': 'touchStart',
    'touchmove': 'touchMove',
    'touchend': 'touchEnd',
    'tap': 'tap',
    'longtap': 'longTap'
};

function touchFromEvent(event) {
    var touch = event.touches[0];
    if (touch.x != undefined) {
        return touch;
    }
    var offset = {left: 0, right: 0};
    if (event.target) {
        offset.left = event.target.offsetLeft;
        offset.top = event.target.offsetTop;
    }
    return {x: touch.clientX - offset.left, y: touch.clientY - offset.top};
}

function packageWXEvent(eventName, event){
    var touch = touchFromEvent(event);
    //根据event 找到对应可以响应的 shape
    var shapeList = this._shapeManager.shapeList;
    var len = shapeList.length;
    for (var pos = len - 1; pos >= 0; pos--) {
        var shape = shapeList[pos];
        if (shape.canRespondTouch(eventName, touch)) {
            return {target: shape, touch: touch};
        }
    }
    return {target: this._picasso, touch: touch};
}

function packageH5Event(eventName, event) {
    var touch = {x:event.x, y:event.y};
    var shapeList = this._shapeManager.shapeList;
    var len = shapeList.length;
    for (var pos = len - 1; pos >= 0; pos--) {
        var shape = shapeList[pos];
        if (shape.canRespondTouch(eventName, touch)) {
            return {target: shape, touch: touch};
        }
    }
    return {target: this._picasso, touch: touch};
}


const wxHandlerMap = {
    'touchstart': function (e) {
        let event = packageWXEvent.apply(this, ['touchstart', e]);
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
        console.log(e);
        let event = packageWXEvent.apply(this, ['tap', e]);
        event.target.trigger && event.target.trigger('tap', event);
    },
    'longtap': function (e) {
        let event = packageWXEvent.apply(this, ['longtap', e]);
        event.target.trigger && event.target.trigger('longtap', event);
    }
};

const h5HandlerMap = {
    'onclick': function (e) {
        var event = packageH5Event.apply(this, ['onclick', e]);
        event.target.trigger && event.target.trigger('onclick', event);
    },
    'ondblclick': function (e) {
        var event = packageH5Event.apply(this, ['ondblclick', e]);
        event.target.trigger && event.target.trigger('ondblclick', event);
    },
    'onmouseover': function (e) { //Canvas是第一响应者
        this._picasso.trigger('onmouseover', event);
    },
    'onmousemove': function (e) {
        var event = packageH5Event.apply(this, ['onmousemove', e]);
        event.target && event.target.trigger('onmousemove', event);
    },
    'onmouseout': function (e) {
        this._picasso.trigger('onmouseout', event);
    },
    //暂不支持 onmousedown, onmouseup
};

function EventHandler (picasso, shapeManager, page, eventMap = wxEventMap) {
    this._page = page;
    this._picasso = picasso;
    this._shapeManager = shapeManager;
    const self = this;
    if (typeof wx == 'undefined') { 
        util.each(h5HandlerMap, function(handler, name){
            page[name] = util.bind(handler, self);
        });
    } else {
        util.each(eventMap, function(originName, name){
            page[originName] = util.bind(wxHandlerMap[name], self);
        });
    }
};

EventHandler.prototype = {
    contructor: EventHandler,
    on: function (originName, func, context) {
        this._page[originName] = util.bind(func, context ? context : this);
    }
}

module.exports = EventHandler;