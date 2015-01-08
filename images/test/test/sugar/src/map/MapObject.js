/**
 * Created by kenkozheng on 2014/10/16.
 */

var MapObject = cc.Sprite.extend({

    /**
     * 对应Constant地图元素类型
     */
    objectCode:0,
    row:0,
    column:0,

    /**
     * 是否固定，阻止上方糖果掉落
     */
    block:true,
    /**
     * UI的深度
     */
    depth:2,

    ctor: function (column, row, texture) {
        this._super();
        this.column = column;
        this.row = row;
        if(texture){
            this.setSpriteFrame(texture);
        }
    }
});