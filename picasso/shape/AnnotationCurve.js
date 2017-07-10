const max_cache_count = 5;
const Shape = require('../Shape');

var AnnotationCurve = Shape.extends({
    type: 'AnnotationCurve',
    interactive: false,
    path: [],
    painted_count: 0,
    cache_flag: 0,
    addPoint: function (point) {
        if (!point) {
            return;
        }
        this.cache_flag++;
        this.path.push(point);
        console.log(this.cache_flag);
        if (this.cache_flag >= max_cache_count) {
            this.incrementalPaint();
            this.cache_flag = 0;
        }
    },
    incrementalPaint: function () {
        const ctx = this._picasso.ctx;
        const len = this.path.length;
        var delta = 0;//增量
        var startPoint;
        if (this.painted_count == 0) {
            startPoint = this.path[0];
            delta = 1; //默认起点已画
        } else {
            startPoint = this.path[this.painted_count - 1];
        }
        var startPoint = this.painted_count == 0 ? this.path[0] : this.path[this.painted_count -1];
        ctx.save();
        ctx.beginPath();
        ctx.setStrokeStyle('red');
        ctx.setLineWidth(3);
        ctx.moveTo(startPoint.x, startPoint.y);
        var pos = this.painted_count == 0 ? 1 : this.painted_count;
        for (;pos < len; pos++, delta++) {
            var point = this.path[pos];
            ctx.lineTo(point.x, point.y);
        }
        this.painted_count += delta;
        ctx.stroke();
        ctx.draw(true);
        ctx.restore();
    },
    paint: function () {
        const len = this.path.length;
        if (len > 0) {
            const ctx = this._picasso.ctx;
            var startPoint = this.path[0];
            ctx.save();
            ctx.beginPath();
            ctx.setStrokeStyle('red');
            ctx.setLineWidth(3);
            ctx.moveTo(startPoint.x, startPoint.y);
            for (var pos = 1;pos < len; pos++) {
                var point = this.path[pos];
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            ctx.restore();
        }
    },
    touchstart: function (event) {
        this.addPoint(event.touch);
    },
    touchmove: function (event) {
        this.addPoint(event.touch);
    }
});

module.exports = AnnotationCurve;

