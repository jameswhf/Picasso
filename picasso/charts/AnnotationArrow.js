//绘制箭头时, 箭头高度: element.height * 2
const arrow_height_element = {
    min: 5,
    medium: 10,
    max: 15
};
const Shape = require('../Shape');

/**
 * 根据 start与end的角度、endPoint与startPoint间的距离radius、箭头高度element
 * @param {number} angle
 * @param {*} radius:
 * @param {*} width 
 */
function getSymmetricPoints(startPoint, angle, radius, height) {
    var deltaAngle = Math.atan(height/radius); //对称两个点相对于start、end角度的偏移角度
    var left_angle = angle + deltaAngle,
        right_angle = angle - deltaAngle;
    return [
        {
            x: startPoint.x + Math.ceil(radius * Math.cos(left_angle)),
            y: startPoint.y + Math.ceil(radius * Math.sin(left_angle))
        },
        {
            x: startPoint.x + Math.ceil(radius * Math.cos(right_angle)),
            y: startPoint.y + Math.ceil(radius * Math.sin(right_angle))
        }
    ];

}
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
            var symmetricPoints = getSymmetricPoints(startPoint, angle, radius, element_height/2);
            const ctx = this._picasso.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.setFillStyle('red');
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(symmetricPoints[0].x, symmetricPoints[0].y);
            ctx.lineTo(symmetricPoints[1].x, symmetricPoints[1].y);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.translate(endPoint.x, endPoint.y);
            ctx.rotate(angle);
            ctx.moveTo(0, -element_height);
            ctx.lineTo(0, element_height);
            ctx.lineTo(2 * element_height, 0);
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

