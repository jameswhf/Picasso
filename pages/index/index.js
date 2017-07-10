//index.js
//获取应用实例
const picasso = require('../../picasso/picasso');
const AnnotationCurve = require('../../picasso/shape/AnnotationCurve');
const AnnotationArrow = require('../../picasso/shape/AnnotationArrow');
const Sector = require('../../picasso/shape/Sector');
const Group = require('../../picasso/Group');

Page({
  data: {
  },
  pi: null,
  currentShape: null,

  onLoad: function () {
    var chartCanvas = {id: 'chart', width: 350, height: 300};
    let chartPI = picasso.init(this, chartCanvas);
    const radius = 100;
    const list = [{percent: 0.18}, {percent: 0.02}, {percent: 0.39}, {percent: 0.21}, {percent: 0.2}];
    const colors = ['#7CB5EC', '#434348', '#90ED7D', '#F7A35C', '#8085E9', '#F15C80'];
    var sectorGroup = new Group();
    var flagAngle = 0;
    list.forEach((item, index) => {
      var sector = new Sector({
        center: {x: 150, y: 150},
        outerRadius: radius,
        startAngle: flagAngle,
        endAngle: flagAngle + Math.PI * 2 * item.percent,
        style: {
          fill: colors[index]
        },
        touchstart: function () {
          if (sectorGroup.selectedShape != this) {
            if (sectorGroup.selectedShape) {
              sectorGroup.selectedShape.translate = null;
            }
            sectorGroup.selectedShape = this;
            var middleAngle = (this.startAngle + this.endAngle) / 2.0;
            this.translate = {x: 10 * Math.cos(middleAngle), y: 10 * Math.sin(middleAngle)};
            this._picasso.render();
          }
        }
      });
      sectorGroup.addShape(sector);
      flagAngle = sector.endAngle;
    });
    chartPI.addGroup(sectorGroup);
    return;


    var canvas = { id: 'annotation', width: 375, height: 400 };
    var page = this;
    let pi = picasso.init(this, canvas, {touchstart: 'aTouchMove', touchmove: 'aTouchMove', touchend: 'aTouchEnd'});
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
