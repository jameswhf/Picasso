function Group(picasso) {
    this._picasso = picasso;
    this.shapes = [];
}

Group.prototype = {
    type: 'Group',
    constructor: Group,
    addShape: function(shape) {
        this.shapes.push(shape);
    }
};

module.exports = Group;