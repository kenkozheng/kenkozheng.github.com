/**
 * Created by kenkozheng on 2014/10/23.
 */

/**
 * 类似糖果，但有倒计步数，超过步数自动爆炸，游戏结束
 */
var SugarBomb = Sugar.extend({

    block:true,
    recycle:false,
    steps:0,
    _text:null,

    ctor: function (column, row, steps) {
        this._super(parseInt(Math.random()*Constant.SUGAR_TYPE_COUNT) + 1, column, row);
        this.steps = steps;
        var text = new cc.Sprite("#sugar_bomb_" + steps + ".png");
        text.x = Constant.SUGAR_WIDTH/2;
        text.y = Constant.SUGAR_WIDTH/2;
        text.scale = 1.5;
        this.addChild(text);
        this._text = text;
    },

    setEffect: function (effect) {
        this._super(effect);
        this.removeChild(this._text);
    },

    decreaseSteps: function () {
        this.steps--;
        if(this.steps > 0){
            this._text.setSpriteFrame("sugar_bomb_" + this.steps + ".png");
        }
    },

    isOver: function () {
        return this.steps <= 0;
    }

});