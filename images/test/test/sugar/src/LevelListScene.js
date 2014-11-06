/**
 * Created by kenkozheng on 2014/11/5.
 */

var LevelListLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var menu = new cc.Menu();
        this.addChild(menu);
        var length = Config.levels.length;
        for (var i = 0; i < length; i++) {
            var item = new cc.MenuItemLabel(new cc.LabelTTF("第" + (i+1) + "关", "Arial", 36), this.menuItemClickHandler, menu);
            item.name = "" + i;
            menu.addChild(item);
        }
        var args = [];
        for (var i = 0; i < length/5; i++) {
            args.push(5);
        }
        if(length%5 > 0 && length > 5)
            args.push(length%5);
        trace(args);
        menu.alignItemsInColumns.apply(menu, args);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    cc.director.end();
                }
            }}, this);
    },

    menuItemClickHandler: function (target) {
        Game.level = parseInt(target.name);
        cc.director.runScene(new GameScene());
    }
});

var LevelListScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelListLayer();
        this.addChild(layer);
    }
});