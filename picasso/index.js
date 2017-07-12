const Picasso = require('./Picasso');
module.exports = {
    init: function (page, canvas, eventMap) {
        return new Picasso(page, canvas, eventMap);
    },
    Picasso: Picasso,
    /**
     * 图形集
     */
    Shape: require('./Shape'),
    Group: require('./Group'),
    AnnotationArrow: require('./shape/AnnotationArrow'),
    AnnotationCurve: require('./shape/AnnotationCurve'),
    Sector: require('./shape/Sector'),
    Tooltip: require('./shape/Tooltip'),
    /**
     * 工具集
     */
    Platform: require('./tool/platform'),
    Util: require('./tool/util'),
};