/**
 * Created by kenkozheng on 2014/11/26.
 */

var ChocolateMachine = MapObject.extend({

    ctor: function (column, row) {
        this._super(column, row, "chocolate_machine.png");
    },

    grow: function (targetColumn, targetRow) {
        //TODO show animation
    }
});