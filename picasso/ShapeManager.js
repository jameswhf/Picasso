
function ShapeManager (picasso) {
    this._picasso = picasso;
    this.shapeList = [];
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
    },
    reset: function () {
        this.shapeList = [];
    }
}

module.exports = ShapeManager;