
var GameLayer = cc.Layer.extend({
    sprite:null,

    sugars:null,
    moving:false,

    sugarPanel:null,
    ui:null,

    ctor:function () {
        this._super();

        var size = cc.winSize;
		Game.steps = 0;

        cc.spriteFrameCache.addSpriteFrames("res/images/sugar.plist");

        var bg = new cc.Sprite("res/images/bg.jpg");
        this.addChild(bg, 1);
        bg.x = size.width/2;
        bg.y = size.height/2;

        this.sugarPanel = new cc.SpriteBatchNode("res/images/sugar.png");
        this.sugarPanel.x = (size.width - Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT)/2;
        this.sugarPanel.y = (size.height - Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT)/2;
        this.addChild(this.sugarPanel, 2);
        if("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({event: cc.EventListener.TOUCH_ONE_BY_ONE, onTouchBegan: this._onTouchBegan.bind(this)}, this.sugarPanel);
        else
            cc.eventManager.addListener({event: cc.EventListener.MOUSE, onMouseDown: this._onMouseDown.bind(this)}, this.sugarPanel);

        //init sugars
        this.sugars = [];
        for (var i = 0; i < Constant.SUGAR_COUNT; i++) {
            var column = [];
            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                var sugar = Sugar.create(parseInt(Math.random()*5) + 1, i, j);
                this.sugarPanel.addChild(sugar);
                sugar.x = i * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                sugar.y = j * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                column.push(sugar);
            }
            this.sugars.push(column);
        }

        this.ui = new GameUI();
        this.addChild(this.ui, 3);

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event) {
                    if (keyCode == cc.KEY.back) {
                        cc.director.end();
                    }
                }}, this);

        return true;
    },

    _onTouchBegan: function (touch, event) {
        var column = Math.floor((touch.getLocation().x - this.sugarPanel.x)/Constant.SUGAR_WIDTH);
        var row = Math.floor((touch.getLocation().y - this.sugarPanel.y)/Constant.SUGAR_WIDTH);
        this._popSugars(column, row);
		return true;
    },

    _onMouseDown: function (event) {
        var column = Math.floor((event.getLocationX() - this.sugarPanel.x)/Constant.SUGAR_WIDTH);
        var row = Math.floor((event.getLocationY() - this.sugarPanel.y)/Constant.SUGAR_WIDTH);
        this._popSugars(column, row);
    },

    _popSugars: function (column, row) {
		if(column < 0 || column >= Constant.SUGAR_COUNT || row < 0 || row >= Constant.SUGAR_COUNT)
			return;
        if(this.moving)
            return;

        ///find join sugars
        var joinSugars = [this.sugars[column][row]];
        var index = 0;
        var pushIntoSugars = function(element){
            if(joinSugars.indexOf(element) < 0)
                joinSugars.push(element);
        };
        while(index < joinSugars.length){
            var sugar = joinSugars[index];
            if(sugar.column > 0 && this.sugars[sugar.column-1][sugar.row].type == sugar.type){
                pushIntoSugars(this.sugars[sugar.column-1][sugar.row]);
            }
            if(sugar.column < Constant.SUGAR_COUNT-1 && this.sugars[sugar.column+1][sugar.row].type == sugar.type){
                pushIntoSugars(this.sugars[sugar.column+1][sugar.row]);
            }
            if(sugar.row > 0 && this.sugars[sugar.column][sugar.row-1].type == sugar.type){
                pushIntoSugars(this.sugars[sugar.column][sugar.row-1]);
            }
            if(sugar.row < Constant.SUGAR_COUNT-1 && this.sugars[sugar.column][sugar.row+1].type == sugar.type){
                pushIntoSugars(this.sugars[sugar.column][sugar.row+1]);
            }

            index++;
        }

        if(joinSugars.length <= 1)
            return;

        Game.steps++;
        Game.score += 5 * joinSugars.length * joinSugars.length;
        this.moving = true;
        for (var i = 0; i < joinSugars.length; i++) {
            cc.pool.putInPool(joinSugars[i]);
            this.sugarPanel.removeChild(joinSugars[i]);
            this.sugars[joinSugars[i].column][joinSugars[i].row] = null;
        }

        this._sugarFalls();
    },

    _sugarFalls: function () {
        var maxTime = 0;
        for (var i = 0; i < Constant.SUGAR_COUNT; i++) {        //deal each column
            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                var sugar = this.sugars[i][j];
                if(!sugar)
                    continue;
                var fallLength = 0;
                for (var k = 0; k < j; k++) {       //find out how long will each sugar falls
                    if(this.sugars[i][k] == null){
                        fallLength++;
                    }
                }
                if(fallLength > 0){
                    var duration = fallLength/Constant.FALL_SPEED;
                    if(duration > maxTime)
                        maxTime = duration;
                    var move = cc.moveTo(duration, cc.p(sugar.x, sugar.y-Constant.SUGAR_WIDTH*fallLength));
                    sugar.runAction(move);
                }
            }
        }
        this.scheduleOnce(this._generateNewSugars.bind(this), maxTime);
    },

    //change logic data and generate new sugars
    _generateNewSugars: function () {
        this.moving = false;
        for (var i = 0; i < Constant.SUGAR_COUNT; i++) {        //deal each column
            for (var j = Constant.SUGAR_COUNT - 1; j >= 0; j--) {
                if(this.sugars[i][j] == null)
                    this.sugars[i].splice(j, 1);        //logically move all sugars, remove all blank holes
            }
            for (var j = this.sugars[i].length; j < Constant.SUGAR_COUNT; j++) {
                var sugar = Sugar.create(parseInt(Math.random()*5) + 1, i, j);
                this.sugarPanel.addChild(sugar);
                sugar.x = i * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                sugar.y = j * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                this.sugars[i].push(sugar);
            }
            for (var j = Constant.SUGAR_COUNT - 1; j >= 0; j--) {
                this.sugars[i][j].row = j;              //adjust all sugars' row
            }
        }
        this._checkLevelSucceed();
    },

    _checkLevelSucceed: function () {
        if(Game.score >= Constant.levels[Game.level]){
            this.ui.showSuccess();
            this.scheduleOnce(function(){
                Game.level++;
                cc.director.runScene(new GameScene());
            }, 3);
        }
    },

    traceSugars: function () {
        trace("============================")
        for (var i = Constant.SUGAR_COUNT - 1; i >= 0; i--) {        //deal each row
            var row = [];
            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                row.push(this.sugars[j][i]?this.sugars[j][i].type:0);
            }
            trace(row);
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

