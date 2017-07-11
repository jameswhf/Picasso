const Util = require('../tool/util');
const Shape = require('../Shape');

function caculatePosition(size) {
    var { anchorPoint, bounds } = this.position;
    if (!anchorPoint) {
        anchorPoint = {x: 0, y: 0};
    }
    if (!bounds) {
        bounds = {x: 0, y: 0, w: this._picasso.canvasWidth, h: this._picasso.canvasHeight};
    }
    var pos = {x: 0, y: 0};
    //默认在anchorPoint的右侧
    const rightGap = bounds.x + bounds.w - anchorPoint.x;
    const topGap = anchorPoint.y - bounds.y;
    if (rightGap >= size.w) {
        pos.x = anchorPoint.x;
    } else if (anchorPoint.x - bounds.x >= size.w) {
        pos.x = anchorPoint.x - size.w;
    } else {
        pos.x = anchorPoint.x - (rightGap - size.w);
    }
    if (topGap >= size.h / 2) {
        pos.y = anchorPoint.y - size.h / 2;
    } else {
        pos.y = bounds.y;
    }
    return pos;
}

function paintDefaultTooltip() {
    const { title, subtitles } = this.data;
    const size = {w: 100, h: 40};
    const pos = caculatePosition.apply(this, [size]);
    const ctx = this._picasso.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.setFillStyle('#4285F4');
    ctx.fillRect(pos.x, pos.y, size.w, size.h);
    ctx.setFillStyle('red');
    ctx.setFontSize(20);
    ctx.fillText(title, pos.x, pos.y);
    ctx.restore();
}
/**
 * Tooltip是浮动展示的, 需要设置方提供一个锚点(anchorPoint), 并给出边界(默认为canvas的size)
 * Tooltip根据锚点、边界、自身大小选择合适的呈现方式
 */
var Tooltip = Shape.extends({
    type: 'tooltip-default',
    interactive: false,
    style: {
        fill: 'brown',
    },
    /**
     * paint也是tooltip的工厂方法
     */
    paint: function () {
        switch(this.type) {
            case Tooltip.types.DEFAULT: {
                paintDefaultTooltip.call(this);
                break;
            }
        }
    }
});

Tooltip.types = {
    DEFAULT: 'tooltip-default',
};


module.exports = Tooltip;