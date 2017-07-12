const util = require('./util');

const isWX = typeof wx != 'undefined';

module.exports = {
    device: isWX ?  wx.getSystemInfoSync() : {},
    crossPlatform: crossPlatform,
};
/**
 * 
 * @param {Object} context, canvas的contex
 */
function crossPlatform (context) {
    if (isWX) { //小程序，需要兼容旧版、扩展H5的API
        //TODO: 扩展H5的API

    } else { //H5 需要扩展 小程序的API
        const setterMap = {
            setStrokeStyle: 'strokeStyle',
            setFillStyle: 'fillStyle',
            setLineWidth: 'lineWidth',
            setLineJoin: 'lineJoin',
            setLineCap: 'lineCap',
            setMiterLimit: 'miterLimit',
            setTextAlign: 'textAlign',
            setGlobalAlpha: 'globalAlpha'
        };
        util.each(setterMap, function (h5Key, wxKey) {
            context[wxKey] = function (value) {
                this[h5Key] = value;
            }
        });
        context.setFontSize = function (s) {
            this.font = s + 'px serif';
        }
        context.setShadow = function (offsetX = 0, offsetY = 0, blur = 0, color = 'black') {
            this.shadowOffsetX = offsetX;
            this.shadowOffsetY = offsetY;
            this.shadowBlur = blue;
            this.shadowColor = color;
        }
        context.draw = context.draw || (() => { console.log('canvas rendered') });
    }
    return context;
}