//index.js
//获取应用实例
const picasso = require('../../picasso/picasso');
const AnnotationCurve = require('../../picasso/charts/AnnotationCurve');
const AnnotationArrow = require('../../picasso/charts/AnnotationArrow');
Page({
  data: {
  },
  pi: null,
  currentShape: null,
  onLoad: function () {
    var canvas = { id: 'annotation', width: 300, height: 300 };
    var page = this;
    let pi = picasso.init(this, canvas);
    pi.trigger = function (eventName, event) {
      if (!page.data.mode) {
        return;
      }
      switch (eventName) {
        case 'touchstart': {
          if (!page.currentShape) {
            var shape;
            if (page.data.mode == 'line') {
              shape = new AnnotationCurve({});
            } else {
              shape = new AnnotationArrow({});
            }
            pi.addShape(shape);
            page.setData({
              undoEnabled: true
            });
            shape.trigger(eventName, event);
            page.currentShape = shape;
          }
          break;
        }
        case 'touchmove': {
          page.currentShape.trigger(eventName, event);
          break;
        }
        case 'touchend': {
          var lastShape = page.currentShape;
          page.currentShape = null;
          lastShape.trigger(eventName, event);
        }
      }
    }
    this.pi = pi;
  },
  tapLine: function() {
    this.setData({
      mode: 'line'
    });
  },
  tapArrow: function() {
    this.setData({
      mode: 'arrow'
    });
  },
  tapUndo: function () {
    this.pi.shapeManager.shapeList.pop();
    this.setData({
      undoEnabled: this.pi.shapeManager.shapeList.length > 0
    });
    this.pi.render();
  },
  bindClear: function () {
    this.setData({
      undoEnabled: false
    });
    this.pi.clear();
  }
})
