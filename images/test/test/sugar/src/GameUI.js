/**
 * Created by kenkozheng on 2014/9/15.
 */

var GameUI = cc.Layer.extend({

    levelText:null,
    scoreText:null,
    stepText:null,
    timeText:null,
    propLayer:null,

    gameLayer:null,

    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
        cc.spriteFrameCache.addSpriteFrames("res/images/ui.plist");

        var size = cc.director.getWinSize();

		var closeItem = new cc.MenuItemImage(
			res.CloseNormal_png,
			res.CloseSelected_png,
			function () {
				cc.director.end();
			}, this);
		closeItem.attr({
			x: size.width - 40,
			y: 40,
			anchorX: 0.5,
			anchorY: 0.5,
			scaleX: 2,
			scaleY: 2
		});

		var menu = new cc.Menu(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 2);

        this._initInfoPanel();
        this._initPropPanel();

        this.propLayer = new cc.Layer();
        this.addChild(this.propLayer, 10);

        this.scheduleUpdate();
    },

    _initInfoPanel: function () {
        var size = cc.director.getWinSize();
        var levelLabel = new cc.LabelTTF("Level", "arial", 36);
        levelLabel.x = 80;
        levelLabel.y = size.height - 50;
        levelLabel.setColor(cc.color(0,0,0));
        this.addChild(levelLabel);

        var levelText = new cc.LabelTTF("1", "arial", 36);
        levelText.x = 80;
        levelText.y = levelLabel.y - 40;
        levelText.setColor(cc.color(0,0,0));
        this.addChild(levelText);
        this.levelText = levelText;

        var scoreLabel = new cc.LabelTTF("Score", "arial", 36);
        scoreLabel.x = 310;
        scoreLabel.y = levelLabel.y;
        scoreLabel.setColor(cc.color(0,0,0));
        this.addChild(scoreLabel);

        var scoreText = new cc.LabelTTF("1", "arial", 36);
        scoreText.x = 310;
        scoreText.y = levelText.y;
        scoreText.setColor(cc.color(0,0,0));
        this.addChild(scoreText);
        this.scoreText = scoreText;

        var stepLabel = new cc.LabelTTF("Step", "arial", 36);
        stepLabel.x = 500;
        stepLabel.y = levelLabel.y;
        stepLabel.setColor(cc.color(0,0,0));
        this.addChild(stepLabel);

        var stepText = new cc.LabelTTF(""+this.gameLayer.limitStep, "arial", 36);
        stepText.x = 500;
        stepText.y = levelText.y;
        stepText.setColor(cc.color(0,0,0));
        this.addChild(stepText);
        this.stepText = stepText;

        var timeText = new cc.LabelTTF("0", "arial", 42);
        timeText.x = 650;
        timeText.y = levelText.y;
        timeText.setColor(cc.color(0,0,0));
        this.addChild(timeText);
        this.timeText = timeText;
    },

    _initPropPanel: function () {
        var size = cc.director.getWinSize();
        var hammerButton = new cc.MenuItemImage("#hammer.png", "#hammer.png", this._propButtonClickHandler.bind(this));
        hammerButton.name = Constant.PROP_HAMMER;
        var addStepButton = new cc.MenuItemImage("#add_step.png", "#add_step.png", this._propButtonClickHandler.bind(this));
        addStepButton.name = Constant.PROP_MORE_STEP;
        var addTimeButton = new cc.MenuItemImage("#add_time.png", "#add_time.png", this._propButtonClickHandler.bind(this));
        addTimeButton.name = Constant.PROP_MORE_TIME;
        var rocketButton = new cc.MenuItemImage("#rocket.png", "#rocket.png", this._propButtonClickHandler.bind(this));
        rocketButton.name = Constant.PROP_ROCKET;
        var pauseButton = new cc.MenuItemToggle(new cc.MenuItemImage("#pause.png", "#pause.png"), new cc.MenuItemImage("#resume.png", "#resume.png"), this._pauseGame.bind(this));

        var menu = new cc.Menu(hammerButton, addStepButton, addTimeButton, rocketButton, pauseButton);
        menu.x = size.width/2;
        menu.y = 100;
        menu.alignItemsHorizontally();
        this.addChild(menu, 3);
    },

    _pauseGame: function (target) {
        if(cc.director.isPaused()){
            cc.director.resume();
        }else{
            cc.director.pause();
        }
    },

    _propButtonClickHandler: function (target) {
        var propId = parseInt(target.name);
        this.finishUsingProp();
        if(this.gameLayer.usingPropId == propId){
            return;
        }
        switch (propId){
            case Constant.PROP_HAMMER:
                var hammer = new cc.Sprite("#hammer.png");
                this.propLayer.addChild(hammer);
                hammer.x = 100;
                hammer.y = 200;
                this.gameLayer.usingPropId = propId;
                break;

            case Constant.PROP_ROCKET:
                var rocket = new cc.Sprite("#rocket.png");
                this.propLayer.addChild(rocket);
                rocket.x = 100;
                rocket.y = 200;
                this.gameLayer.usingPropId = propId;
                break;

            case Constant.PROP_MORE_STEP:
                //TODO 效果
                this.gameLayer.limitStep += Constant.PROP_MORE_STEP_COUNT;
                break;

            case Constant.PROP_MORE_TIME:
                //TODO 效果
                this.gameLayer.limitTime += Constant.PROP_MORE_TIME_COUNT;
                break;
        }
    },

    finishUsingProp: function () {
        //TODO
        this.propLayer.removeAllChildren();
    },

    showSuccess: function () {
        var bg = new cc.LayerColor(cc.color(255,255,255),500,500);
        this.addChild(bg, 1);
        var size = cc.director.getWinSize();
        bg.x = (size.width - bg.width)/2;
        bg.y = (size.height - bg.height)/2;
        var stepText = new cc.LabelTTF("恭喜，已完成第" + (this.gameLayer.level+1) + "关", "arial", 56);
        stepText.setColor(cc.color(0,0,0));
        stepText.x = 250;
        stepText.y = 250;
        bg.addChild(stepText);
    },

    showFail: function () {
        var bg = new cc.LayerColor(cc.color(255,255,255),500,500);
        this.addChild(bg, 1);
        var size = cc.director.getWinSize();
        bg.x = (size.width - bg.width)/2;
        bg.y = (size.height - bg.height)/2;
        var stepText = new cc.LabelTTF("失败了", "arial", 56);
        stepText.setColor(cc.color(0,0,0));
        stepText.x = 250;
        stepText.y = 250;
        bg.addChild(stepText);
    },

    update: function () {
        this.levelText.setString("" + (this.gameLayer.level+1));
        this.scoreText.setString("" + this.gameLayer.score);
        this.stepText.setString("" + (this.gameLayer.limitStep - this.gameLayer.steps));

        var limit = Config.levels[this.gameLayer.level].limit;
        if(!limit.step && limit.time){
            this.timeText.setString("" + Math.max(0, limit.time - this.gameLayer.timeElapsed));
        }
    }

});