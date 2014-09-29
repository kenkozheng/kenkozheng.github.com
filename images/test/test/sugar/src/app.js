
var GameLayer = cc.Layer.extend({
    sprite:null,

    sugars:null,
    moving:false,

    sugarPanel:null,
    effectPanel:null,
    ui:null,

    chosenSugars:null,

    ctor:function () {
        this._super();

        var size = cc.winSize;
		Game.steps = 0;

        cc.spriteFrameCache.addSpriteFrames("res/images/sugar.plist");

        var bg = new cc.Sprite("res/images/bg.jpg");
        this.addChild(bg, 1);
        bg.x = size.width/2;
        bg.y = size.height/2;

        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 2);
        this.sugarPanel = new cc.SpriteBatchNode("res/images/sugar.png");
        this.sugarPanel.x = (size.width - Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT)/2;
        this.sugarPanel.y = (size.height - Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT)/2;
        clippingPanel.addChild(this.sugarPanel, 1);

        this.effectPanel = new cc.Sprite();
        clippingPanel.addChild(this.effectPanel, 2);

        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this.sugarPanel.x,this.sugarPanel.y), cc.p(this.sugarPanel.x+Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT,this.sugarPanel.y+Constant.SUGAR_WIDTH*Constant.SUGAR_COUNT),
            cc.color(0,0,0), 1, cc.color(0,0,0));
        clippingPanel.stencil = stencil;

        if("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({event: cc.EventListener.TOUCH_ONE_BY_ONE, onTouchBegan: this._onTouchBegan.bind(this)}, this.sugarPanel);
        else
            cc.eventManager.addListener({event: cc.EventListener.MOUSE, onMouseDown: this._onMouseDown.bind(this)}, this.sugarPanel);

        //init sugars
        this.sugars = [];
        for (var i = 0; i < Constant.SUGAR_COUNT; i++) {
            var column = [];
            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                var sugar = Sugar.create(parseInt(Math.random()*3) + 1, i, j);
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

        if(joinSugars[0].status == Constant.STATUS_NORMAL){
            if(this.chosenSugars && this.chosenSugars.indexOf(joinSugars[0]) < 0){
                for (var i = 0; i < this.chosenSugars.length; i++) {
                    this.chosenSugars[i].markChosen(false);
                }
            }
            for (var i = 0; i < joinSugars.length; i++) {
                joinSugars[i].markChosen(true);
            }
            this.chosenSugars = joinSugars;
        } else {
            Game.steps++;
            this.moving = true;

            var existEffectSugars = [];
            for (var i = 0; i < joinSugars.length; i++) {
                if(joinSugars[i].effect != Constant.EFFECT_NONE)
                    existEffectSugars.push(joinSugars[i]);
            }

            var effectSugars = this._checkEffectSugars(joinSugars);
            for (var i = 0; i < joinSugars.length; i++) {
                if(effectSugars.indexOf(joinSugars[i]) >= 0)
                    continue;
                this._removeSugar(joinSugars[i]);
            }

            this._showSugarEffects(existEffectSugars);
        }
    },

    /**
     * 展示特殊糖果作用
     * @param existEffectSugars
     * @private
     */
    _showSugarEffects: function (existEffectSugars) {
        var newEffectSugars = [];
        if(existEffectSugars.length){
            for (var i = 0; i < existEffectSugars.length; i++) {
                var sugar = existEffectSugars[i];
                switch (sugar.effect){
                    case Constant.EFFECT_HORIZONTAL:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.sugarPanel.x;
                        effect.y = this.sugarPanel.y;
                        effect.drawRect(cc.p(0, sugar.row*Constant.SUGAR_WIDTH),
                            cc.p(Constant.SUGAR_COUNT*Constant.SUGAR_WIDTH, (sugar.row+1)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_VERTICAL:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.sugarPanel.x;
                        effect.y = this.sugarPanel.y;
                        effect.drawRect(cc.p(sugar.column*Constant.SUGAR_WIDTH, 0),
                            cc.p((sugar.column+1)*Constant.SUGAR_WIDTH, Constant.SUGAR_COUNT*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_BOMB:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.sugarPanel.x;
                        effect.y = this.sugarPanel.y;
                        effect.drawRect(cc.p((sugar.column-1)*Constant.SUGAR_WIDTH,(sugar.row-1)*Constant.SUGAR_WIDTH),
                            cc.p((sugar.column+2)*Constant.SUGAR_WIDTH,(sugar.row+2)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_COLORFUL:

                        break;
                }
            }

            function schedule() {
                this.effectPanel.removeAllChildren();
                for (var i = 0; i < existEffectSugars.length; i++) {
                    var sugar = existEffectSugars[i];
                    switch (sugar.effect){
                        case Constant.EFFECT_HORIZONTAL:
                            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                                var sugar1 = this.sugars[j][sugar.row];
                                if(sugar1){
                                    if(sugar1.effect != Constant.EFFECT_NONE && existEffectSugars.indexOf(sugar1) < 0)
                                        newEffectSugars.push(sugar1);
                                    this._removeSugar(sugar1);
                                }
                            }
                            break;

                        case Constant.EFFECT_VERTICAL:
                            for (var j = 0; j < Constant.SUGAR_COUNT; j++) {
                                var sugar1 = this.sugars[sugar.column][j];
                                if(sugar1){
                                    if(sugar1.effect != Constant.EFFECT_NONE && existEffectSugars.indexOf(sugar1) < 0)
                                        newEffectSugars.push(sugar1);
                                    this._removeSugar(sugar1);
                                }
                            }
                            break;

                        case Constant.EFFECT_BOMB:
                            for (var j = -1; j <= 1; j++) {
                                for (var k = -1; k <= 1; k++) {
                                    if(j == 0 && k == 0)
                                        continue;
                                    if(sugar.column+j >= 0 && sugar.column+j < Constant.SUGAR_COUNT && sugar.row+k >= 0 && sugar.row+k < Constant.SUGAR_COUNT){
                                        var sugar1 = this.sugars[sugar.column+j][sugar.row+k];
                                        if(sugar1){
                                            if(sugar1.effect != Constant.EFFECT_NONE && existEffectSugars.indexOf(sugar1) < 0)
                                                newEffectSugars.push(sugar1);
                                            this._removeSugar(sugar1);
                                        }
                                    }
                                }
                            }
                            break;

                        case Constant.EFFECT_COLORFUL:

                            break;
                    }
                }
                this._showSugarEffects(newEffectSugars);
            }
            this.scheduleOnce(schedule.bind(this), 2.5);

        }else{
            //特效糖为空就表示已经完成所有爆炸，开始掉落糖果，补充空位
            this._sugarFalls();
            this._checkLevelSucceed();
            this.chosenSugars = null;
        }
    },

    _removeSugar: function (sugar) {
        //防止重复删除
        if(this.sugars[sugar.column][sugar.row]){
            cc.pool.putInPool(sugar);
            this.sugarPanel.removeChild(sugar);
            this.sugars[sugar.column][sugar.row] = null;
        }
    },

    /**
     * 检查出全部特效糖果
     * @param joinSugars
     * @returns {Array}
     * @private
     */
    _checkEffectSugars: function (joinSugars) {
        var beginColumn = Constant.SUGAR_COUNT;
        var beginRow = Constant.SUGAR_COUNT;
        var endColumn = 0;
        var endRow = 0;
        for (var i = 0; i < joinSugars.length; i++) {
            beginColumn = Math.min(joinSugars[i].column, beginColumn);
            beginRow = Math.min(joinSugars[i].row, beginRow);
            endColumn = Math.max(joinSugars[i].column, endColumn);
            endRow = Math.max(joinSugars[i].row, endRow);
        }

        var allSugars = this.sugars;
        function checkExist(i, j){
            if(i >= beginColumn && i <= endColumn && j >= beginRow && j <= endRow){
                return (allSugars[i][j].status != Constant.STATUS_DELETE && joinSugars.indexOf(allSugars[i][j]) >= 0);
            }
            return false;
        }

        //check colorful sugars and line sugars
        var colorfulSugars = [];
        var lineSugars = [];
        if(endColumn - beginColumn >= 3){
            for (var j = beginRow; j <= endRow; j++) {
                var sequenceCount = 0;
                for (var i = beginColumn; i <= endColumn; i++) {
                    if(checkExist(i, j)) {
                        sequenceCount++;
                        if(sequenceCount == 4) {
                            //标记这些糖已经被用了转为彩糖
                            for (var k = 0; k < 4; k++) {
                                this.sugars[i-k][j].status = Constant.STATUS_DELETE;
                            }
                            if(checkExist(i+1,j)) {
                                colorfulSugars.push(this.sugars[i-1][j]);
                                this.sugars[i+1][j].status = Constant.STATUS_DELETE;
                                i++;
                            }else{
                                lineSugars.push(this.sugars[i-1][j]);
                            }
                            sequenceCount = 0;
                        }
                    } else {
                        sequenceCount = 0;
                    }
                }
            }
        }
        if(endRow - beginRow >= 3){
            for (var i = beginColumn; i <= endColumn; i++) {
                var sequenceCount = 0;
                for (var j = beginRow; j <= endRow; j++) {
                    if(checkExist(i, j)) {
                        sequenceCount++;
                        if(sequenceCount == 4) {
                            for (var k = 0; k < 4; k++) {
                                this.sugars[i][j-k].status = Constant.STATUS_DELETE;
                            }
                            if(checkExist(i,j+1)){
                                colorfulSugars.push(this.sugars[i][j-1]);
                                this.sugars[i][j+1].status = Constant.STATUS_DELETE;
                                j++;
                            }else{
                                lineSugars.push(this.sugars[i][j-1]);
                            }
                            sequenceCount = 0;
                        }
                    } else {
                        sequenceCount = 0;
                    }
                }
            }
        }

        //check bomb sugars
        var bombSugars = [];
        if((endColumn - beginColumn >= 2) && (endRow - beginRow >= 2)){
            for (var i = beginColumn; i <= endColumn; i++) {
                for (var j = beginRow; j <= endRow; j++) {
                    if(!checkExist(i,j)) {
                        continue;
                    }
                    var horizontal = 0;
                    var vertical = 0;
                    if(checkExist(i-1,j) && checkExist(i+1,j)){
                        horizontal = 2;
                    }else if(checkExist(i-2,j) && checkExist(i-1,j)){
                        horizontal = 1;
                    }else if(checkExist(i+1,j) && checkExist(i+2,j)){
                        horizontal = 3;
                    }
                    if(checkExist(i,j-1) && checkExist(i,j+1)){
                        vertical = 2;
                    }else if(checkExist(i,j-2) && checkExist(i,j-1)){
                        vertical = 1;
                    }else if(checkExist(i,j+1) && checkExist(i,j+2)){
                        vertical = 3;
                    }

                    //排除十字形
                    if(horizontal == 2 && vertical == 2)
                        continue;

                    if(horizontal && vertical){
                        bombSugars.push(this.sugars[i][j]);

                        if(horizontal == 1){
                            this.sugars[i-2][j].status = Constant.STATUS_DELETE;
                            this.sugars[i-1][j].status = Constant.STATUS_DELETE;
                        }else if(horizontal == 2){
                            this.sugars[i-1][j].status = Constant.STATUS_DELETE;
                            this.sugars[i+1][j].status = Constant.STATUS_DELETE;
                        }else if(horizontal == 3){
                            this.sugars[i+2][j].status = Constant.STATUS_DELETE;
                            this.sugars[i+1][j].status = Constant.STATUS_DELETE;
                        }

                        if(vertical == 1){
                            this.sugars[i][j-2].status = Constant.STATUS_DELETE;
                            this.sugars[i][j-1].status = Constant.STATUS_DELETE;
                        }else if(vertical == 2){
                            this.sugars[i][j-1].status = Constant.STATUS_DELETE;
                            this.sugars[i][j+1].status = Constant.STATUS_DELETE;
                        }else if(vertical == 3){
                            this.sugars[i][j+2].status = Constant.STATUS_DELETE;
                            this.sugars[i][j+1].status = Constant.STATUS_DELETE;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < colorfulSugars.length; i++) {
            colorfulSugars[i].setEffect(Constant.EFFECT_COLORFUL);
            colorfulSugars[i].status = Constant.STATUS_NORMAL;
        }
        for (var i = 0; i < lineSugars.length; i++) {
            lineSugars[i].setEffect(Math.random() < 0.5 ? Constant.EFFECT_HORIZONTAL:Constant.EFFECT_VERTICAL);
            lineSugars[i].status = Constant.STATUS_NORMAL;
        }
        for (var i = 0; i < bombSugars.length; i++) {
            bombSugars[i].setEffect(Constant.EFFECT_BOMB);
            bombSugars[i].status = Constant.STATUS_NORMAL;
        }
//        return [].concat(colorfulSugars, lineSugars, bombSugars);
        return [].concat(lineSugars, bombSugars);
    },

    _sugarFalls: function () {
        var maxTime = 0;
        var totalDeleted = 0;
        for (var i = 0; i < Constant.SUGAR_COUNT; i++) {        //deal each column
            var missCount = 0;
            for (var j = 0; j < this.sugars[i].length; j++) {
                var sugar = this.sugars[i][j];
                if(!sugar){
                    sugar = Sugar.create(parseInt(Math.random()*5) + 1, i, Constant.SUGAR_COUNT+missCount);
                    this.sugarPanel.addChild(sugar);
                    sugar.x = sugar.column * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                    sugar.y = sugar.row * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                    this.sugars[i].push(sugar);
                    missCount++;
                    totalDeleted++;
                    continue;
                }

                var fallLength = 0;
                //大于10，表示是刚新加的
                if(j >= Constant.SUGAR_COUNT){
                    fallLength = missCount;
                } else {
                    for (var k = 0; k < j; k++) {       //find out how long will each sugar falls
                        if(this.sugars[i][k] == null){
                            fallLength++;
                        }
                    }
                }

                if(fallLength > 0){
                    var duration = fallLength/Constant.FALL_SPEED;
                    if(duration > maxTime)
                        maxTime = duration;
                    var move = cc.moveTo(duration, cc.p(sugar.x, sugar.y-Constant.SUGAR_WIDTH*fallLength));
                    sugar.runAction(move);
                    sugar.row -= fallLength;        //adjust all sugars' row
                }
            }
            for (var j = Constant.SUGAR_COUNT - 1; j >= 0; j--) {
                if(this.sugars[i][j] == null)
                    this.sugars[i].splice(j, 1);        //logically move all sugars, remove all blank holes
            }
        }
        this.scheduleOnce(this._finishSugarFalls.bind(this), maxTime);
        Game.score += 5 * totalDeleted * totalDeleted;
    },

    _finishSugarFalls: function () {
        this.moving = false;
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

