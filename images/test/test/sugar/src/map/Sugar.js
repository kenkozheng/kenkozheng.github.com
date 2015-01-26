/**
 * Created by Kenko on 2014/9/14.
 */

var Sugar = MapObject.extend({

    block:false,

    type: 0,
    /**
     * 普通0，选中1，消除2
     */
    status:0,
    effect:0,

    effectLayer:null,
    image:null,

    ctor: function (type, column, row) {
        this._super(column, row);
        this.reuse(type, column, row);
    },

    reuse: function (type, column, row) {
        if(!this.image){
            this.image = new cc.Sprite();
            this.image.x = Constant.SUGAR_WIDTH/2;
            this.image.y = Constant.SUGAR_WIDTH/2;
            this.addChild(this.image, 2);
        }
        this.image.setSpriteFrame("" + type + ".png");
        this.setSpriteFrame("sugar_bg.png");
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
                if(this.effect == Constant.EFFECT_HORIZONTAL || this.effect == Constant.EFFECT_VERTICAL){
                    this.image.setSpriteFrame("" + this.type + "_3.png");
                } else {
                    this.image.setSpriteFrame("" + this.type + "_1.png");
                }
            }
            this.status = Constant.STATUS_CHOSEN;
        } else {
            if(this.effect == Constant.EFFECT_HORIZONTAL || this.effect == Constant.EFFECT_VERTICAL){
                this.image.setSpriteFrame("" + this.type + "_2.png");
            } else if (this.effect != Constant.EFFECT_COLORFUL){
                this.image.setSpriteFrame("" + this.type + ".png");
            }
            this.status = Constant.STATUS_NORMAL;
        }
    },

    setEffect: function (effect) {
        this.effect = effect;
        this.markChosen(false);
        this._removeEffectLayer();
        if(effect != Constant.EFFECT_NONE){
            var frameCountConfig = [0, 4, 4, 3, 4, 0, 8];

            this.effectLayer = new cc.Sprite("#effect_" + effect + "/1.png");
            var animationFrames = [];
            for (var i = 1; i <= frameCountConfig[effect]; i++) {
                animationFrames.push(cc.spriteFrameCache.getSpriteFrame("effect_" + effect + "/" + i + ".png"));
            }
            var animation = new cc.Animation(animationFrames, 0.1);
            this.effectLayer.runAction(cc.animate(animation).repeatForever());

            this.effectLayer.x = Constant.SUGAR_WIDTH/2;
            this.effectLayer.y = Constant.SUGAR_WIDTH/2;

            if(effect == Constant.EFFECT_HORIZONTAL || effect == Constant.EFFECT_VERTICAL){
                this.image.setSpriteFrame("" + this.type + "_2.png");
            } else if(effect == Constant.EFFECT_COLORFUL){
                this.image.setSpriteFrame("colorful.png");
            }

            if(effect == Constant.EFFECT_CROSS || effect == Constant.EFFECT_COLORFUL || effect == Constant.EFFECT_BOMB){
                this.addChild(this.effectLayer, 1);
            } else {
                this.addChild(this.effectLayer, 3);
            }
        }
    }

});

Sugar.create = function (column, row, type) {
    if (cc.pool.hasObject(Sugar)) {
        return cc.pool.getFromPool(Sugar, type, column, row);
    } else {
        return new Sugar(type, column, row);
    }
};