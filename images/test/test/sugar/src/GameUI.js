/**
 * Created by kenkozheng on 2014/9/15.
 */

var GameUI = cc.Layer.extend({

    levelText:null,
    scoreText:null,
    stepText:null,
    timeText:null,

    ctor: function () {
        this._super();

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

        var stepText = new cc.LabelTTF("1", "arial", 36);
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

        this.scheduleUpdate();
    },

    showSuccess: function () {
        var bg = new cc.LayerColor(cc.color(255,255,255),500,500);
        this.addChild(bg, 1);
        var size = cc.director.getWinSize();
        bg.x = (size.width - bg.width)/2;
        bg.y = (size.height - bg.height)/2;
        var stepText = new cc.LabelTTF("恭喜，已完成第" + (Game.level+1) + "关", "arial", 56);
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
        this.levelText.setString("" + (Game.level+1));
        this.scoreText.setString("" + Game.score);
        this.stepText.setString("" + Game.steps);

        var limit = Config.levels[Game.level].limit;
        if(!limit.step && limit.time){
            this.timeText.setString("" + Math.max(0, limit.time - Game.timeElapsed));
        }
    }

});