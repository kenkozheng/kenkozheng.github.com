/**
 * Created by Kenko on 2014/9/14.
 */

var Sugar = cc.Sprite.extend({

    type: 1,

    column: 0,
    row: 0,

    ctor: function (type, column, row) {
        this._super();
        this.reuse(type, column, row);
    },

    reuse: function (type, column, row) {
        this.setSpriteFrame("" + type + ".png");
        this.type = type;
        this.column = column;
        this.row = row;
    },

    unuse: function () {
		this.retain();
    }

});

Sugar.create = function (type, column, row) {
    if (cc.pool.hasObject(Sugar)) {
        return cc.pool.getFromPool(Sugar, type, column, row);
    }
    else {
        return new Sugar(type, column, row);
    }
}