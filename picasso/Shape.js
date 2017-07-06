const util = require('./tool/util');

function Shape(config) {
    /**
     * 图形是否可见
     */
    this.visible = util.initBool(config.visible);
    /**
     * 图形是否能响应事件
     */
    this.interactive = util.initBool(config.interactive);
    /**
     * 图形Style
     */
    this.style = config.style;
    this._config = config;
}

Shape.prototype = {
    type: 'Shape',

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
     * touch位置(x, y)检测
     */
    isHitInside: function () {
    },

    trigger: function () {

    },
};