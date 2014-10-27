/**
 * Created by kenkozheng on 2014/10/16.
 */

var BlankHole = MapObject.extend({

    block:false,
    depth:5,

    ctor: function (column, row) {
        this._super(column, row, "blank_hole.png");
    }

});