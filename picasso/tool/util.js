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
    }
};