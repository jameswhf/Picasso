
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
    reset: function () {
        this.shapeList = [];
    }
}

module.exports = ShapeManager;