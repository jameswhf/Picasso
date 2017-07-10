//绘制箭头时, 箭头高度: element.height * 2
const arrow_height_element = {
    min: 5,
    medium: 10,
    max: 15
};
const Shape = require('../Shape');

/**
 * 计算 startPoint 跟 endPoint 间的角度
 * @param {number} offsetX : endPoint.x - startPoint.x 
 * @param {number} offsetY : endPoint.y - startPoint.y
 * @param {number} radius  : endPoint 与 startPoint 间的距离
 */
function caculateAngle(offsetX, offsetY, radius) {
    var angle = Math.acos(offsetX /radius);
    if (offsetX >= 0) { //1、4象限
        if (offsetY < 0) {
            angle = -angle;
        }
    } else {//对于2、3象限
        if (offsetY < 0) {
            angle = 2 * Math.PI - angle;
        }
    }
    return angle;
}


var AnnotationArrow = Shape.extends({
    type: 'AnnotationArrow',
    startPoint: null,
    endPoint: null,
    updatePoint: function (point) {
        if (!point) {
            return;
        }
        if (!this.startPoint) {
            this.startPoint = point;
        } else {
            var lastPoint = this.endPoint ? this.endPoint : this.startPoint;
            var offset = Math.max(Math.abs(lastPoint.x - point.x), Math.abs(lastPoint.y - point.y));
            if (offset > 10) {
                this.endPoint = point;
                this.dirty();
            }
        }
    },
    paint: function () {
        if (this.startPoint && this.endPoint) {
            var startPoint = this.startPoint, endPoint = this.endPoint;
            var offsetX = endPoint.x - startPoint.x,
                offsetY = endPoint.y - startPoint.y,
                radius = Math.sqrt(offsetX * offsetX + offsetY * offsetY),
                element_height = arrow_height_element.min;
            if (radius > 50) {
                element_height = radius > 150 ? arrow_height_element.max : arrow_height_element.medium;
            }
            const angle = caculateAngle(offsetX, offsetY, radius);
            /**
             * 先按距离绘制一个与x轴方向平行的箭头, 然后在旋转
             * 当距离小于 2 * element_height 时只画箭头
             */
            const ctx = this._picasso.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.setFillStyle('red');
            ctx.translate(startPoint.x, startPoint.y);
            ctx.rotate(angle);
            if (radius <= 2 * element_height) { //只画箭头
                ctx.moveTo(0, element_height);
                ctx.lineTo(2 * element_height, 0);
                ctx.lineTo(0, - element_height);
            } else { //画箭柄、箭头
                ctx.moveTo(0, 0);
                var joinPoint = {x: radius - 2 * element_height, y: 0};
                ctx.lineTo(joinPoint.x, joinPoint.y + element_height / 2 );
                ctx.lineTo(joinPoint.x, joinPoint.y + element_height);
                ctx.lineTo(radius, 0);
                ctx.lineTo(joinPoint.x, joinPoint.y - element_height);
                ctx.lineTo(joinPoint.x, joinPoint.y - element_height / 2 );
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    },
    touchstart: function (event) {
        this.updatePoint(event.touch);
    },
    touchmove: function (event) {
        this.updatePoint(event.touch);
    }
});

module.exports = AnnotationArrow;

