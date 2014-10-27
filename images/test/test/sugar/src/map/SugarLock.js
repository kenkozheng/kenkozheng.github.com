/**
 * Created by Kenko on 2014/10/26.
 */


var SugarLock = Sugar.extend({

    block:true,
    recycle:false,

    ctor: function (column, row) {
        this._super(parseInt(Math.random()*Constant.SUGAR_TYPE_COUNT) + 1, column, row);
        var lock = new cc.Sprite("#lock.png");
        this.addChild(lock);
        lock.x = lock.y = Constant.SUGAR_WIDTH/2;
    }
});