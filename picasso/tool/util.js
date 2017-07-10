module.exports = {
    /**
     * 绑定func到context
     */
    bind: function(func, context) {
        return function () {
            func.apply(context, arguments);
        };
    },
    /**
     * 遍历对象，执行 cb
     */
    each: function (target, cb) {
        for (var key in target) {
            cb(target[key], key);
        }
    },
    /**
     * 配置初始化时 bool 判断
     */
    initBool: function (value) {
        if (value === false) {
            return false;
        }
        return true;
    },
    /**
     * 构造继承关系
     * @param {Function} 子类
     * @param {Function} 父类
     */
    inherits: function (childClass, superClass) {
        var childOriginPrototype = childClass.prototype;
        function F () {}
        F.prototype = superClass.prototype;
        childClass.prototype = new F();
        for ( var prop in childOriginPrototype) {
            childClass.prototype[prop] = childOriginPrototype[prop];
        }
        childClass.prototype.constructor = childClass;
        childClass.superClass = superClass;
    },
    /**
     * 实现对象的深拷贝
     */
    clone: function (instance) {
        if (null == instance || 'object' != typeof instance) {
            return instance;
        }
        var self = this;
        if (instance instanceof Array) {
            var arr = [];
            instance.forEach(item => arr.push(self.clone(item)));
            return arr;
        }
        var obj = {};
        this.each(instance, (value, key) => {
            obj[key] = self.clone(value);
        });
        return obj;
    },
    /**
     * 计算 startPoint 跟 endPoint 间的角度
     * @param {number} offsetX : endPoint.x - startPoint.x 
     * @param {number} offsetY : endPoint.y - startPoint.y
     * @param {number} radius  : endPoint 与 startPoint 间的距离
     */
    caculateAngle: function (offsetX, offsetY, radius) {
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
};