const util = require('./tool/util');

function formatedConfig(config) {
    /**
     * 图形是否可见
     */
    config.visible = util.initBool(config.visible);
        /**
     * 图形是否能响应事件
     */
    config.interactive = util.initBool(config.interactive);
    return config;
}

function Shape(config) {
    var self = this;
    util.each(formatedConfig(config), function(value, key){
        self[key] = value;
    });
    this._rawConfig = config;
}

Shape.prototype = {
    type: 'Shape',
    
    //绘制
    beforePaint: function() {

    },
    paint: function () {

    },
    afterPaint: function() {

    },
    //触发canvas重绘
    dirty: function () {
        this._picasso && this._picasso.render();
    },
    /**
     * 判断是否可以响应touch
     * @param {String}, 事件名称
     * @param {Object}, touch对象{ x: , y: }
     */
    canRespondTouch: function (eventName, touch) {
        return this.visible && this.interative && this[eventName] && this.isHitInside(touch);
    },
    /**
     * touch位置(x, y)检测
     */
    isHitInside: function (touch) {
        return false;
    },
    trigger: function (eventName, event) {
        if (this[eventName]) {
            this[eventName](event);
        }
    },
};

/**
 * 定义Shape子类的方法
 */
Shape.extends = function (childBaseConfig) {
    var childShape = function (config) {
        Shape.call(this, Object.assign(util.clone(childBaseConfig), config));//
    };
    util.inherits(childShape, Shape);
    return childShape;
}

module.exports = Shape;