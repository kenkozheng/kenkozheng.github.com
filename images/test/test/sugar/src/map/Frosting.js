/**
 * Created by kenkozheng on 2014/10/23.
 */

var Frosting = MapObject.extend({

    content:null,
    level:0,

    ctor: function (column, row, level, content) {
        this._super(column, row);
        this.content = content;
        this.level = level;
        this.setSpriteFrame("frosting_" + this.level + ".png");
    },

    decreaseLevel: function () {
        this.level--;
        if(this.level >= 1){
            this.setSpriteFrame("frosting_" + this.level + ".png");
        }
    }
});