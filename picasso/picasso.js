var ShapeManager = require('./ShapeManager');
var EventHandler = require('./EventHandler');


var picasso = {};

picasso.init = function (page, canvas, eventMap) {
    const pi =  new Picasso(page, canvas, eventMap);
    return pi;
}


function Picasso (page, canvas, eventMap) {
    this.page = page;
    this.id = canvas.id;
    this.ctx = wx.createCanvasContext(canvas.id);
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.canvasName = canvas.name;

    const self = this;
    this.shapeManager = new ShapeManager(self);
    this.eventHandler = new EventHandler(self, self.shapeManager, page, eventMap);
}

Picasso.prototype = {
    constructor: Picasso,
    addShape: function (shape) {
        this.shapeManager.add(shape);
    },
    removeShape: function (shape) {
        this.shapeManager.remove(shape);
    },
    clear: function () {
        this.shapeManager.reset();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.draw();
    },
    render: function() {
        // this.shapeManager
        var shapeList = this.shapeManager.shapeList;
        for (var pos = 0; pos < shapeList.length; pos++) {
          shapeList[pos].paint();
        }
        this.ctx.draw();
    },

    /**
     * 可以通过 此方法替换 canvas 的默认事件监听方法 
     * @param originEventName 指 wxml 里 canvas中绑定的事件的名字
     * @param func 事件监听方法
     * @param context [optional] func绑定的context, 默认是 eventHanlder
     */
    on: function (originEventName, func, context) {
        this.eventHandler.on(originEventName, func, context);
    }
};

module.exports = picasso;