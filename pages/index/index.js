//index.js
//获取应用实例
const picasso = require('../../picasso/picasso');
Page({
  data: {
  },
  pi: null,
  onLoad: function () {
    var canvas = { id: 'annotation', width: 300, height: 300 };
    this.pi = picasso.init(this, canvas);
  }
})
