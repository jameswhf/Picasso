const Util = require('../tool/util');
const Shape = require('../Shape');

var Sector = Shape.extends({
    type: 'Sector',
    center: { x: 0, y: 0 },
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
    style: {
        fill: 'brown',
    },
    paint: function () {
        var {center, innerRadius, outerRadius, startAngle, endAngle, style} = this;
        const ctx = this._picasso.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setFillStyle(style.fill);
        if (this.translate) {
            ctx.translate(this.translate.x, this.translate.y);
        }
        ctx.translate(center.x, center.y);
        var sCos = Math.cos(startAngle), sSin = Math.sin(startAngle); 
        ctx.moveTo(innerRadius * sCos, innerRadius * sSin);
        ctx.lineTo(outerRadius * sCos, outerRadius * sSin);
        ctx.arc(0, 0, outerRadius, startAngle, endAngle);
        ctx.lineTo(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle));
        if (innerRadius != 0) {
            ctx.arc(0, 0, innerRadius, startAngle, endAngle);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    isHitInside: function (touch) {
        var offsetX = touch.x - this.center.x,
            offsetY = touch.y - this.center.y,
            radius = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        if (radius < this.innerRadius || radius > this.outerRadius) {
            return false;
        }
        var angle = Util.caculateAngle(offsetX, offsetY, radius);
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        if (angle < this.startAngle || angle > this.endAngle) {
            return false;
        }
        return true;
    },
});

module.exports = Sector;

