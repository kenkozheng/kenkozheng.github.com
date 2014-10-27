/**
 * Created by Kenko on 2014/9/14.
 */

var Sugar = MapObject.extend({

    block:false,
    recycle:true,

    type: 0,
    /**
     * 普通0，选中1，消除2
     */
    status:0,
    effect:0,

    effectLayer:null,

    ctor: function (type, column, row) {
        this._super(column, row);
        this.reuse(type, column, row);
    },

    reuse: function (type, column, row) {
        this.setSpriteFrame("" + type + ".png");
        this.status = Constant.STATUS_NORMAL;
        this.type = type;
        this.column = column;
        this.row = row;
        this.effectLayer = null;
        this.effect = Constant.EFFECT_NONE;
    },

    unuse: function () {
		this.retain();
        this._removeEffectLayer();
    },

    _removeEffectLayer: function () {
        if(this.effectLayer) {
            this.removeChild(this.effectLayer);
            this.effectLayer = null;
        }
    },

    markChosen: function (chosen) {
        if(chosen){
            if(this.effect == Constant.EFFECT_COLORFUL){
                //TODO 彩糖的选中态
            }else{
                this.setSpriteFrame("" + this.type + "_chosen.png");
            }
            this.status = Constant.STATUS_CHOSEN;
        } else {
            this.setSpriteFrame("" + this.type + ".png");
            this.status = Constant.STATUS_NORMAL;
        }
    },

    setEffect: function (effect) {
        this.effect = effect;
        this.markChosen(false);
        if(effect == Constant.EFFECT_COLORFUL){
            this.type = 0;
            this.setSpriteFrame("colorful.png");
        } else {
            this._removeEffectLayer();
            if(effect == Constant.EFFECT_HORIZONTAL){
                this.effectLayer = new cc.Sprite("#horizontal.png");
            } else if(effect == Constant.EFFECT_VERTICAL){
                this.effectLayer = new cc.Sprite("#vertical.png");
            } else if(effect == Constant.EFFECT_BOMB){
                this.effectLayer = new cc.Sprite("#bomb.png");
            } else if(effect == Constant.EFFECT_BIG_BOMB){
                this.effectLayer = new cc.Sprite("#big_bomb.png");
            } else if(effect == Constant.EFFECT_CROSS){
                this.effectLayer = new cc.Sprite("#cross.png");
            } else if(effect == Constant.EFFECT_HORIZONTAL_BOMB){
                this.effectLayer = new cc.Sprite("#horizontal_bomb.png");
            } else if(effect == Constant.EFFECT_VERTICAL_BOMB){
                this.effectLayer = new cc.Sprite("#vertical_bomb.png");
            }
            this.effectLayer.x = Constant.SUGAR_WIDTH/2;
            this.effectLayer.y = Constant.SUGAR_WIDTH/2;
            this.addChild(this.effectLayer);
        }
    }

});

Sugar.create = function (column, row, type) {
    type = type || parseInt(Math.random()*Constant.SUGAR_TYPE_COUNT) + 1;
    if (cc.pool.hasObject(Sugar)) {
        return cc.pool.getFromPool(Sugar, type, column, row);
    } else {
        return new Sugar(type, column, row);
    }
}