/**
 * Created by Kenko on 2014/10/26.
 */


var SugarLock = Sugar.extend({

    block:true,

    ctor: function (column, row, type) {
        this._super(type, column, row);
        var lock = new cc.Sprite("#lock.png");
        this.addChild(lock, 5);
        lock.x = lock.y = Constant.SUGAR_WIDTH/2;
    }
});