const Tooltip = require('./shape/Tooltip');

function ShapeManager (picasso) {
    this._picasso = picasso;
    this.shapeList = [];
    this.groupList = [];
    this.tooltip = null;
};

ShapeManager.prototype = {
    contructor: ShapeManager,
    getShapeList: function () {
        return this.shapeList;
    },
    add: function (shape) {
        shape._picasso = this._picasso;
        this.shapeList.push(shape);
        shape.dirty();
    },
    remove: function (shape) {
        const index = this.shapeList.indexOf(shape);
        if (index >= 0) {
            this.shapeList.splice(index, 1);
            this._picasso.render();
        }
    },
    addGroup: function (group) {
        var self = this;
        group.shapes.forEach(shape => {
            shape._picasso = self._picasso;
            self.shapeList.push(shape);
        });
        this._picasso.render();
    },
    removeGroup: function (group) {
        var self = this;
        group.shapes.forEach(shape => {
            self.remove(shape);
        });
        const index = this.groupList.indexOf(group);
        if (index >= 0) {
            this.groupList.splice(index, 1);
            this._picasso.render();
        }
    },
    reset: function () {
        this.shapeList = [];
        this.groupList = [];
    },
    /**
     * @param {Object} {type:'', , referer:shape}
     */
    setTooltip: function(tooltipConfig) {
        if (tooltipConfig) { //展示tooltip
            if (!this.tooltip || this.tooltip.referer != tooltipConfig.referer) {
                this.tooltip = new Tooltip(tooltipConfig);
                this.tooltip._picasso = this._picasso;
                this._picasso.render();
            }
        } else { //隐藏tooltip
            if (this.tooltip != null) {
                this.tooltip = null;
                this._picasso.render();
            }
        }
    },
}

module.exports = ShapeManager;