//index.js
//获取应用实例
const picasso = require('../../picasso/picasso');
const AnnotationCurve = require('../../picasso/charts/AnnotationCurve');
const AnnotationArrow = require('../../picasso/charts/AnnotationArrow');
const Sector = require('../../picasso/charts/Sector');
Page({
  data: {
  },
  pi: null,
  currentShape: null,

  onLoad: function () {
    var chartCanvas = {id: 'chart', width: 350, height: 300};
    let chartPI = picasso.init(this, chartCanvas);
    const radius = 60;
    chartPI.addShape(new Sector({
      center: { x: 100, y: 100},
      outerRadius: radius,
      startAngle: 0,
      endAngle: Math.PI / 2,
      style: {
        fill: 'brown'
      }
    }));
    chartPI.addShape(new Sector({
      center: { x: 100, y: 100 },
      outerRadius: radius,
      startAngle: Math.PI / 2,
      endAngle: Math.PI,
      style: {
        fill: 'green'
      }
    }));
    chartPI.addShape(new Sector({
      center: { x: 100, y: 100 },
      outerRadius: radius,
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      style: {
        fill: 'blue'
      }
    }));
    var canvas = { id: 'annotation', width: 375, height: 400 };
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
  tapClear: function () {
    this.setData({
      undoEnabled: false
    });
    this.pi.clear();
  }
})
