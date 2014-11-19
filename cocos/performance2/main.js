var PerformanceTest = cc.Scene.extend({
	
	panel:null,

	ctor:function(){
		this._super();
		this.panel = new cc.SpriteBatchNode("res/grossini.png");
		this.addChild(this.panel);
		
		if("touches" in cc.sys.capabilities){
            cc.eventManager.addListener({event: cc.EventListener.TOUCH_ONE_BY_ONE, onTouchBegan: this.addOne.bind(this)}, this);
        }else{
			cc.eventManager.addListener({event: cc.EventListener.MOUSE, onMouseDown:this.addOne.bind(this)}, this);
        }
	},
	
	addOne:function(){
		for(var i = 0; i < 50; i++)
		{
			var sprite = new cc.Sprite("res/grossini.png");
			var action = cc.rotateBy(1,100,100).repeatForever();
			sprite.runAction(action);
			this.panel.addChild(sprite);
			sprite.x = Math.random()*720;
			sprite.y = Math.random()*1280;
		}
	}
});

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(["res/grossini.png"], function () {
        cc.director.runScene(new PerformanceTest());
    }, this);
};
cc.game.run();

var trace = function() {
    cc.log(Array.prototype.join.call(arguments, ", "));
};