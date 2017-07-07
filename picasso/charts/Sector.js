
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
    tap: function (event) {

    }
});

module.exports = Sector;

