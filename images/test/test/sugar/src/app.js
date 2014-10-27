
var GameLayer = cc.Layer.extend({

    mapPanel:null,
    effectPanel:null,
    ui:null,

    map:null,
    /**
     * 已选中的糖果
     */
    chosenSugars:null,

    /**
     * 糖果还在移动，不接受再次点击
     */
    moving:false,
    /**
     * 本次消除，被扫中的条纹糖数目
     */
    popLineSugarsCount:0,
    /**
     * 本次消除，被扫中的包装糖数目
     */
    popBombSugarsCount:0,
    /**
     * 点击的位置
     */
    popColumn:0,
    popRow:0,
    /**
     * 由特殊糖引起的多次爆炸，当前是第几轮。每次点击，此属性重置0
     */
    explodeRound:0,
    /**
     * 记录每一轮糖霜的被消除情况，防止重复消除
     */
    frostingDecreaseRecord:null,
    /**
     * 标记特殊糖爆炸过程中是否遇到甘草漩涡
     */
    hitWhirlpool:false,


    ctor:function () {
        this._super();

        var size = cc.winSize;
        cc.spriteFrameCache.addSpriteFrames("res/images/sugar.plist");

        var bg = new cc.Sprite("res/images/bg.jpg");
        this.addChild(bg, 1);
        bg.x = size.width/2;
        bg.y = size.height/2;

        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 2);
        this.mapPanel = new cc.SpriteBatchNode("res/images/sugar.png");
        this.mapPanel.x = (size.width - Constant.SUGAR_WIDTH*Constant.MAP_SIZE)/2;
        this.mapPanel.y = (size.height - Constant.SUGAR_WIDTH*Constant.MAP_SIZE)/2;
        clippingPanel.addChild(this.mapPanel, 1);

        this.effectPanel = new cc.Sprite();
        clippingPanel.addChild(this.effectPanel, 2);

        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this.mapPanel.x,this.mapPanel.y), cc.p(this.mapPanel.x+Constant.SUGAR_WIDTH*Constant.MAP_SIZE,this.mapPanel.y+Constant.SUGAR_WIDTH*Constant.MAP_SIZE),
            cc.color(0,0,0), 1, cc.color(0,0,0));
        clippingPanel.stencil = stencil;

        if("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({event: cc.EventListener.TOUCH_ONE_BY_ONE, onTouchBegan: this._onTouchBegan.bind(this)}, this.mapPanel);
        else
            cc.eventManager.addListener({event: cc.EventListener.MOUSE, onMouseDown: this._onMouseDown.bind(this)}, this.mapPanel);

        this._init();

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

    _init: function () {
        Game.score = 0;
        Game.steps = 0;
        Game.sugarPopCount = [0,0,0,0,0];
        Game.timeElapsed = 0;
        this.schedule((function(){
            Game.timeElapsed++;
            if(!Config.levels[Game.level].limit.step){
                this._checkLevelSucceedOrFail();
            }
        }).bind(this), 1);

        this.map = [];
        for (var i = 0; i < Constant.MAP_SIZE; i++) {
            var column = [];
            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                var objectConfig = Config.levels[Game.level].map[i][j];
                var mapObject = this._generateMapObject(objectConfig, i, j);
                this.mapPanel.addChild(mapObject, mapObject.depth);
                mapObject.x = i * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                mapObject.y = j * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
                column.push(mapObject);
            }
            this.map.push(column);
        }
    },

    /**
     * 生成地图元素
     * @param config Config文件中的数字串
     * @param column
     * @param row
     * @returns {*}
     * @private
     */
    _generateMapObject: function (config, column, row) {
        var mapObject = null;
        var objectCode = parseInt(config.toString()[0]);            //第一位是类型
        var objectParam = config.toString().substring(1); //后续的数字是参数
        switch (objectCode){
            case Constant.MAP_SUGAR:
                mapObject = Sugar.create(column, row);
                break;

            case Constant.MAP_FROSTING:
                var level = parseInt(objectParam[0]);
                mapObject = new Frosting(column, row, level, objectParam[1]);
                break;

            case Constant.MAP_SUGAR_BOMB:
                var steps = parseInt(objectParam[0]);
                mapObject = new SugarBomb(column, row, steps);
                break;

            case Constant.MAP_WHIRLPOOL:
                mapObject = new Whirlpool(column, row);
                break;

            case Constant.MAP_SUGAR_LOCK:
                mapObject = new SugarLock(column, row);
                break;

            default:
                mapObject = new BlankHole(column, row);
                break;
        }
        return mapObject;
    },

    _onTouchBegan: function (touch, event) {
        var column = Math.floor((touch.getLocation().x - this.mapPanel.x)/Constant.SUGAR_WIDTH);
        var row = Math.floor((touch.getLocation().y - this.mapPanel.y)/Constant.SUGAR_WIDTH);
        this._popSugars(column, row);
		return true;
    },

    _onMouseDown: function (event) {
        var column = Math.floor((event.getLocationX() - this.mapPanel.x)/Constant.SUGAR_WIDTH);
        var row = Math.floor((event.getLocationY() - this.mapPanel.y)/Constant.SUGAR_WIDTH);
        this._popSugars(column, row);
    },

    _checkSugarExist: function(i, j){
        if(i >= 0 && i < Constant.MAP_SIZE && j >= 0 && j < Constant.MAP_SIZE){
            return ((this.map[i][j] instanceof Sugar) && !(this.map[i][j] instanceof SugarLock) && (this.map[i][j].status != Constant.STATUS_DELETE));
        }
        return false;
    },

    _popSugars: function (column, row) {
		if(column < 0 || column >= Constant.MAP_SIZE || row < 0 || row >= Constant.MAP_SIZE)
			return;
        if(this.moving || !(this.map[column][row] instanceof Sugar) || (this.map[column][row] instanceof SugarLock))
            return;
        this.popColumn = column;
        this.popRow = row;

        if(this.map[column][row].effect == Constant.EFFECT_COLORFUL){
            var random = [];
            if(this._checkSugarExist(column-1,row)){
                random.push(this.map[column-1][row]);
            }
            if(this._checkSugarExist(column+1,row)){
                random.push(this.map[column+1][row]);
            }
            if(this._checkSugarExist(column,row-1)){
                random.push(this.map[column][row-1]);
            }
            if(this._checkSugarExist(column,row+1)){
                random.push(this.map[column][row+1]);
            }
            var second = null;
            for (var i = 0; i < random.length; i++) {
                if(random[i].effect == Constant.EFFECT_COLORFUL){
                    second = random[i];
                    break;
                }
            }
            if(!second){
                second = random[Math.floor(Math.random()*random.length)];
            }
            this._showColorfulEffects(this.map[column][row], second);
        }else{
            ///find join sugars
            var joinSugars = [this.map[column][row]];
            var index = 0;
            var pushIntoSugars = function(element){
                if(joinSugars.indexOf(element) < 0)
                    joinSugars.push(element);
            };
            while(index < joinSugars.length){
                var sugar = joinSugars[index];
                if(this._checkSugarExist(sugar.column-1, sugar.row) && this.map[sugar.column-1][sugar.row].type == sugar.type){
                    pushIntoSugars(this.map[sugar.column-1][sugar.row]);
                }
                if(this._checkSugarExist(sugar.column+1, sugar.row) && this.map[sugar.column+1][sugar.row].type == sugar.type){
                    pushIntoSugars(this.map[sugar.column+1][sugar.row]);
                }
                if(this._checkSugarExist(sugar.column, sugar.row-1) && this.map[sugar.column][sugar.row-1].type == sugar.type){
                    pushIntoSugars(this.map[sugar.column][sugar.row-1]);
                }
                if(this._checkSugarExist(sugar.column, sugar.row+1) && this.map[sugar.column][sugar.row+1].type == sugar.type){
                    pushIntoSugars(this.map[sugar.column][sugar.row+1]);
                }

                index++;
            }

            if(joinSugars.length <= 1)
                return;

            if(joinSugars[0].status == Constant.STATUS_NORMAL && joinSugars[0].effect != Constant.EFFECT_COLORFUL){
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
                this.popBombSugarsCount = 0;
                this.popLineSugarsCount = 0;
                this.explodeRound = 0;
                this.frostingDecreaseRecord = [];
                this.hitWhirlpool = false;

                var existEffectSugars = [];
                for (var i = 0; i < joinSugars.length; i++) {
                    if(joinSugars[i].effect != Constant.EFFECT_NONE)
                        existEffectSugars.push(joinSugars[i]);
                }

                var effectSugars = this._checkEffectSugars(joinSugars);
                for (var i = 0; i < joinSugars.length; i++) {
                    this._removeMapObject(joinSugars[i]);
                }
                //生成特殊糖果
                for (var i = 0; i < effectSugars.length; i++) {
                    var sugar = Sugar.create(effectSugars[i].column, effectSugars[i].row, effectSugars[i].type);
                    this._addMapObject(sugar);
                    sugar.setEffect(effectSugars[i].effect);
                }

                //TODO 播放糖果抖动被消除的效果，特殊糖果有停留原地发光的效果
                this._showSugarEffects(existEffectSugars);
            }
        }
    },

    /**
     * 展示特殊糖果作用（连环爆炸）
     * @param existEffectSugars
     * @private
     */
    _showSugarEffects: function (existEffectSugars) {
        this.explodeRound++;

        //先展示效果
        if(existEffectSugars.length && !this.hitWhirlpool){
            var randomType = this._findRandomSugarType();
            for (var i = 0; i < existEffectSugars.length; i++) {
                var sugar = existEffectSugars[i];
                switch (sugar.effect){
                    case Constant.EFFECT_HORIZONTAL:
                        this.popLineSugarsCount++;
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p(0, sugar.row*Constant.SUGAR_WIDTH),
                            cc.p(Constant.MAP_SIZE*Constant.SUGAR_WIDTH, (sugar.row+1)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_VERTICAL:
                        this.popLineSugarsCount++;
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p(sugar.column*Constant.SUGAR_WIDTH, 0),
                            cc.p((sugar.column+1)*Constant.SUGAR_WIDTH, Constant.MAP_SIZE*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_BOMB:
                        this.popBombSugarsCount++;
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p((sugar.column-1)*Constant.SUGAR_WIDTH,(sugar.row-1)*Constant.SUGAR_WIDTH),
                            cc.p((sugar.column+2)*Constant.SUGAR_WIDTH,(sugar.row+2)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_COLORFUL:
                        //TODO 全部晃动
                        trace("遇到彩糖");
                        break;

                    case Constant.EFFECT_BIG_BOMB:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p((sugar.column-2)*Constant.SUGAR_WIDTH,(sugar.row-2)*Constant.SUGAR_WIDTH),
                            cc.p((sugar.column+3)*Constant.SUGAR_WIDTH,(sugar.row+3)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_CROSS:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p(0, sugar.row*Constant.SUGAR_WIDTH),
                            cc.p(Constant.MAP_SIZE*Constant.SUGAR_WIDTH, (sugar.row+1)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        effect.drawRect(cc.p(sugar.column*Constant.SUGAR_WIDTH, 0),
                            cc.p((sugar.column+1)*Constant.SUGAR_WIDTH, Constant.MAP_SIZE*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_HORIZONTAL_BOMB:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p(0, (sugar.row-1)*Constant.SUGAR_WIDTH),
                            cc.p(Constant.MAP_SIZE*Constant.SUGAR_WIDTH, (sugar.row+2)*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;

                    case Constant.EFFECT_VERTICAL_BOMB:
                        var effect = new cc.DrawNode();
                        this.effectPanel.addChild(effect);
                        effect.x = this.mapPanel.x;
                        effect.y = this.mapPanel.y;
                        effect.drawRect(cc.p((sugar.column-1)*Constant.SUGAR_WIDTH, 0),
                            cc.p((sugar.column+2)*Constant.SUGAR_WIDTH, Constant.MAP_SIZE*Constant.SUGAR_WIDTH), cc.color(255,255,255,180));
                        break;
                }
            }

            function schedule() {
                var newEffectSugars = [];
                var checkAndRemoveObject = (function(o){
                    if(o && (o instanceof Sugar) && o.status != Constant.STATUS_DELETE){
                        if(o.effect != Constant.EFFECT_NONE && existEffectSugars.indexOf(o) < 0)
                            newEffectSugars.push(o);
                    }
                    this._removeMapObject(o);
                }).bind(this);

                this.effectPanel.removeAllChildren();
                for (var i = 0; i < existEffectSugars.length; i++) {
                    var sugar = existEffectSugars[i];
                    switch (sugar.effect){
                        case Constant.EFFECT_HORIZONTAL:
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                checkAndRemoveObject(this.map[j][sugar.row]);
                            }
                            break;

                        case Constant.EFFECT_VERTICAL:
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                checkAndRemoveObject(this.map[sugar.column][j]);
                            }
                            break;

                        case Constant.EFFECT_BOMB:
                            for (var j = -1; j <= 1; j++) {
                                for (var k = -1; k <= 1; k++) {
                                    if(j == 0 && k == 0)
                                        continue;
                                    if(sugar.column+j >= 0 && sugar.column+j < Constant.MAP_SIZE && sugar.row+k >= 0 && sugar.row+k < Constant.MAP_SIZE){
                                        checkAndRemoveObject(this.map[sugar.column+j][sugar.row+k]);
                                    }
                                }
                            }
                            break;

                        //这里只会是爆炸过程中遇到的彩糖，消除场上随机一个颜色
                        case Constant.EFFECT_COLORFUL:
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                for (var k = 0; k < Constant.MAP_SIZE; k++) {
                                    if(this._checkSugarExist(j,k) && this.map[j][k].type == randomType){
                                        checkAndRemoveObject(this.map[j][k]);
                                    }
                                }
                            }
                            break;

                        case Constant.EFFECT_BIG_BOMB:
                            var range = 2;
                            for (var j = -range; j <= range; j++) {
                                for (var k = -range; k <= range; k++) {
                                    if(j == 0 && k == 0)
                                        continue;
                                    if(sugar.column+j >= 0 && sugar.column+j < Constant.MAP_SIZE && sugar.row+k >= 0 && sugar.row+k < Constant.MAP_SIZE){
                                        checkAndRemoveObject(this.map[sugar.column+j][sugar.row+k]);
                                    }
                                }
                            }
                            break;

                        case Constant.EFFECT_CROSS:
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                checkAndRemoveObject(this.map[j][sugar.row]);
                            }
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                checkAndRemoveObject(this.map[sugar.column][j]);
                            }
                            break;

                        case Constant.EFFECT_HORIZONTAL_BOMB:
                            for (var k = Math.max(0,sugar.row-1); k < Constant.MAP_SIZE && k <= sugar.row + 1; k++) {
                                for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                    checkAndRemoveObject(this.map[j][k]);
                                }
                            }
                            break;

                        case Constant.EFFECT_VERTICAL_BOMB:
                            for (var k = Math.max(0,sugar.column-1); k < Constant.MAP_SIZE && k <= sugar.column + 1; k++) {
                                for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                    checkAndRemoveObject(this.map[k][j]);
                                }
                            }
                            break;
                    }
                }
                this._showSugarEffects(newEffectSugars);
            }
            this.scheduleOnce(schedule.bind(this), 1);

        }else{
            //特效糖为空就表示已经完成所有爆炸，开始掉落糖果，补充空位
            this._generateNewSugars();
        }
    },

    /**
     * 点彩糖时，专门的效果
     * @param colorfulSugar
     * @param secondSugar
     * @private
     */
    _showColorfulEffects: function (colorfulSugar, secondSugar){
        this.scheduleOnce((function(){
            secondSugar.markChosen(true);
            this.scheduleOnce((function(){
                this._removeMapObject(colorfulSugar);
                if(secondSugar.effect == Constant.EFFECT_NONE){
                    //TODO 播放糖果抖动被消除的效果，特殊糖果有停留原地发光的效果
                    var existEffectSugars = [];
                    for (var i = 0; i < Constant.MAP_SIZE; i++) {
                        for (var j = 0; j < Constant.MAP_SIZE; j++) {
                            if(this.map[i][j] && this.map[i][j].type == secondSugar.type){
                                if(this.map[i][j].effect != Constant.EFFECT_NONE){
                                    existEffectSugars.push(this.map[i][j]);
                                }
                                this._removeMapObject(this.map[i][j]);
                            }
                        }
                    }
                    this._showSugarEffects(existEffectSugars);

                } else {
                    if(secondSugar.effect == Constant.EFFECT_COLORFUL){
                        //TODO 播放糖果抖动被消除的效果
                        for (var i = 0; i < Constant.MAP_SIZE; i++) {
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                this._removeMapObject(this.map[i][j]);
                            }
                        }
                        this._generateNewSugars();
                    }else{
                        //TODO 播放特效扩散到每个同色糖果的动画
                        for (var i = 0; i < Constant.MAP_SIZE; i++) {
                            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                if(this.map[i][j] && this.map[i][j].type == secondSugar.type
                                    && this.map[i][j] != secondSugar && this.map[i][j].effect == Constant.EFFECT_NONE){
                                    this.map[i][j].setEffect(secondSugar.effect);
                                }
                            }
                        }
                        this.scheduleOnce((function(){
                            var existEffectSugars = [];
                            for (var i = 0; i < Constant.MAP_SIZE; i++) {
                                for (var j = 0; j < Constant.MAP_SIZE; j++) {
                                    if(this.map[i][j] && this.map[i][j].type == secondSugar.type && this.map[i][j] != secondSugar){
                                        existEffectSugars.push(this.map[i][j]);
                                        this._removeMapObject(this.map[i][j]);
                                    }
                                }
                            }
                            this._showSugarEffects(existEffectSugars);
                        }).bind(this), 1.0);
                    }
                }
                this._removeMapObject(secondSugar);
                this.explodeRound++;

            }).bind(this), 0.5);
        }).bind(this), 0.5);
    },

    _removeMapObject: function (object) {
        //防止重复删除
        if(object && (!(object instanceof BlankHole)) && this.map[object.column][object.row]){
            if(!(object instanceof Frosting && object.level > 0)){
                if(object.recycle){
                    cc.pool.putInPool(object);
                }
                this.mapPanel.removeChild(object);
                this.map[object.column][object.row] = null;
                //只有特殊爆炸才能炸掉甘草锁糖果，然后换成普通糖果
                if(object instanceof SugarLock){
                    var sugar = Sugar.create(object.column, object.row, object.type);
                    this._addMapObject(sugar);
                    //TODO 加入甘草锁去除的动画
                }
            }
            this._decreaseFrosting(object.column, object.row);
            this._calculateScore(object);
        }
    },

    _addMapObject: function (object) {
        object.x = object.column * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
        object.y = object.row * Constant.SUGAR_WIDTH + Constant.SUGAR_WIDTH/2;
        this.mapPanel.addChild(object, object.depth);
        this.map[object.column][object.row] = object;
    },

    /**
     * 检查出全部特效糖果
     * @param joinSugars
     * @returns {Array}
     * @private
     */
    _checkEffectSugars: function (joinSugars) {
        var beginColumn = Constant.MAP_SIZE;
        var beginRow = Constant.MAP_SIZE;
        var endColumn = 0;
        var endRow = 0;
        for (var i = 0; i < joinSugars.length; i++) {
            beginColumn = Math.min(joinSugars[i].column, beginColumn);
            beginRow = Math.min(joinSugars[i].row, beginRow);
            endColumn = Math.max(joinSugars[i].column, endColumn);
            endRow = Math.max(joinSugars[i].row, endRow);
        }

        var checkExist = (function(i, j){
            if(i >= beginColumn && i <= endColumn && j >= beginRow && j <= endRow){
                return ((this.map[i][j] instanceof Sugar) && this.map[i][j].status != Constant.STATUS_DELETE && joinSugars.indexOf(this.map[i][j]) >= 0);
            }
            return false;
        }).bind(this);

        //check colorful sugars and line sugars
        var colorfulSugars = [];
        if(endColumn - beginColumn >= 4){
            for (var j = beginRow; j <= endRow; j++) {
                var sequenceCount = 0;
                for (var i = beginColumn; i <= endColumn; i++) {
                    if(checkExist(i, j)) {
                        sequenceCount++;
                        if(sequenceCount == 5) {
                            //标记这些糖已经被用了转为彩糖
                            for (var k = 0; k < 5; k++) {
                                this.map[i-k][j].status = Constant.STATUS_DELETE;
                            }
                            colorfulSugars.push(this.map[i-2][j]);
                            sequenceCount = 0;
                        }
                    } else {
                        sequenceCount = 0;
                    }
                }
            }
        }
        if(endRow - beginRow >= 4){
            for (var i = beginColumn; i <= endColumn; i++) {
                var sequenceCount = 0;
                for (var j = beginRow; j <= endRow; j++) {
                    if(checkExist(i, j)) {
                        sequenceCount++;
                        if(sequenceCount == 5) {
                            for (var k = 0; k < 5; k++) {
                                this.map[i][j-k].status = Constant.STATUS_DELETE;
                            }
                            colorfulSugars.push(this.map[i][j-2]);
                            sequenceCount = 0;
                        }
                    } else {
                        sequenceCount = 0;
                    }
                }
            }
        }

        //check line sugars
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
                                this.map[i-k][j].status = Constant.STATUS_DELETE;
                            }
                            lineSugars.push(this.map[i-1][j]);
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
                                this.map[i][j-k].status = Constant.STATUS_DELETE;
                            }
                            lineSugars.push(this.map[i][j-1]);
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
                        bombSugars.push(this.map[i][j]);

                        if(horizontal == 1){
                            this.map[i-2][j].status = Constant.STATUS_DELETE;
                            this.map[i-1][j].status = Constant.STATUS_DELETE;
                        }else if(horizontal == 2){
                            this.map[i-1][j].status = Constant.STATUS_DELETE;
                            this.map[i+1][j].status = Constant.STATUS_DELETE;
                        }else if(horizontal == 3){
                            this.map[i+2][j].status = Constant.STATUS_DELETE;
                            this.map[i+1][j].status = Constant.STATUS_DELETE;
                        }

                        if(vertical == 1){
                            this.map[i][j-2].status = Constant.STATUS_DELETE;
                            this.map[i][j-1].status = Constant.STATUS_DELETE;
                        }else if(vertical == 2){
                            this.map[i][j-1].status = Constant.STATUS_DELETE;
                            this.map[i][j+1].status = Constant.STATUS_DELETE;
                        }else if(vertical == 3){
                            this.map[i][j+2].status = Constant.STATUS_DELETE;
                            this.map[i][j+1].status = Constant.STATUS_DELETE;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < colorfulSugars.length; i++) {
            colorfulSugars[i].effect = Constant.EFFECT_COLORFUL;
            colorfulSugars[i].status = Constant.STATUS_NORMAL;
        }
        for (var i = 0; i < lineSugars.length; i++) {
            lineSugars[i].effect = Math.random() < 0.5 ? Constant.EFFECT_HORIZONTAL:Constant.EFFECT_VERTICAL;
            lineSugars[i].status = Constant.STATUS_NORMAL;
        }
        for (var i = 0; i < bombSugars.length; i++) {
            bombSugars[i].effect = Constant.EFFECT_BOMB;
            bombSugars[i].status = Constant.STATUS_NORMAL;
        }
        return [].concat(colorfulSugars, lineSugars, bombSugars);
    },

    _generateNewSugars: function () {
        var maxTime = 0;
        if(this.popBombSugarsCount >= 2 || this.popLineSugarsCount >= 2 || (this.popLineSugarsCount >= 1 && this.popBombSugarsCount >= 1)){

            var sugar = Sugar.create(this.popColumn, this.popRow);
            this._addMapObject(sugar);

            if(this.popBombSugarsCount >= 2){
                sugar.setEffect(Constant.EFFECT_BIG_BOMB);
            } else if(this.popLineSugarsCount >= 1 && this.popBombSugarsCount >= 1){
                sugar.setEffect(Constant.EFFECT_HORIZONTAL_BOMB);
            } else if(this.popLineSugarsCount >= 2){
                sugar.setEffect(Constant.EFFECT_CROSS);
            }
        }
        for (var i = 0; i < Constant.MAP_SIZE; i++) {        //deal each column
            var missCount = 0;
            for (var j = 0; j < this.map[i].length; j++) {
                if(this.map[i][j]){
                    if(!(this.map[i][j] instanceof Sugar) || this.map[i][j].block){
                        continue;
                    }
                }

                var blocksCountAbove = 0;
                for (var k = j; k < Constant.MAP_SIZE; k++) {
                    if(this.map[i][k] && this.map[i][k].block){
                        blocksCountAbove++;
                    }
                }

                var sugar = this.map[i][j];
                if(!sugar){
                    if(blocksCountAbove == 0){
                        sugar = Sugar.create(i, Constant.MAP_SIZE+missCount);
                        this._addMapObject(sugar);
                        missCount++;
                    }
                }else{
                    var fallLength = 0;
                    var blankHoleCount = 0;
                    for (var k = j - 1; k >= 0; k--) {       //find out how long will each sugar falls
                        if(this.map[i][k]){
                            if(this.map[i][k].block){
                                break;
                            }else if(this.map[i][k] instanceof BlankHole){
                                blankHoleCount++;
                            }
                        }else{
                            fallLength += blankHoleCount + 1;   //先累计途中有多少个blankhole，如果真遇到空位，就把blankhole个数累计到falllength中。
                            blankHoleCount = 0;
                        }
                    }

                    if(fallLength > 0){
                        var duration = Math.sqrt(2*fallLength/Constant.FALL_ACCELERATION);
                        if(duration > maxTime)
                            maxTime = duration;
                        var move = cc.moveTo(duration, cc.p(sugar.x, sugar.y-Constant.SUGAR_WIDTH*fallLength)).easing(cc.easeIn(2));    //easeIn参数是幂，以几次幂加速
                        sugar.runAction(move);
                        sugar.row -= fallLength;        //adjust all sugars' row
                        this.map[i][j] = null;
                        this.map[i][sugar.row] = sugar;
                    }
                }
            }

            //移除超出地图的临时元素位置
            for (var j = this.map[i].length; j >= Constant.MAP_SIZE; j--) {
                this.map[i].splice(j, 1);
            }
        }
        this.scheduleOnce(this._finishSugarFalls.bind(this), maxTime);
        this._decreaseSugarBombsSteps();
        this._checkLevelSucceedOrFail();
        this.chosenSugars = null;
    },

    _finishSugarFalls: function () {
        this.moving = false;
    },

    _decreaseSugarBombsSteps: function () {
        for (var i = 0; i < Constant.MAP_SIZE; i++) {
            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                if(this.map[i][j] && this.map[i][j] instanceof SugarBomb){
                    this.map[i][j].decreaseSteps();
                }
            }
        }
    },

    /**
     * 消除糖霜一层
     * @param column 糖果消除的位置
     * @param row
     * @private
     */
    _decreaseFrosting: function (column, row) {
        var isFrosting = (function(column, row){
            return (column >= 0 && row >= 0 && column < Constant.MAP_SIZE && row < Constant.MAP_SIZE
                && this.map[column][row] && this.map[column][row] instanceof Frosting);
        }).bind(this);
        var frostingList = [];
        if(isFrosting(column,row)){
            frostingList.push(this.map[column][row]);
        }
        if(isFrosting(column-1,row)){
            frostingList.push(this.map[column-1][row]);
        }
        if(isFrosting(column,row-1)){
            frostingList.push(this.map[column][row-1]);
        }
        if(isFrosting(column+1,row)){
            frostingList.push(this.map[column+1][row]);
        }
        if(isFrosting(column,row+1)){
            frostingList.push(this.map[column][row+1]);
        }

        for (var i = 0; i < frostingList.length; i++) {
            var frosting = frostingList[i];
            //本轮已经消除过这个糖霜
            this.frostingDecreaseRecord[this.explodeRound] = this.frostingDecreaseRecord[this.explodeRound] || [];
            if(this.frostingDecreaseRecord[this.explodeRound].indexOf(frosting) >= 0){
                continue;
            }
            frosting.decreaseLevel();
            if(frosting.level == 0){
                var sugar = this._generateMapObject(frosting.content, frosting.column, frosting.row);
                this._removeMapObject(frosting);
                this._addMapObject(sugar);
            }else{
                this.frostingDecreaseRecord[this.explodeRound].push(frosting);
            }
        }
    },

    _calculateScore: function (sugar) {
        Game.sugarPopCount[sugar.type]++;
        switch (sugar.effect){
            case Constant.EFFECT_NONE:
                Game.score++;
                break;

            case Constant.EFFECT_COLORFUL:
                Game.score += 5;
                break;

            default:
                Game.score += 3;
                break;
        }
    },

    _checkLevelSucceedOrFail: function () {
        var task = Config.levels[Game.level].task;
        var finish = false;
        if(task.score){
            if(Game.score >= task.score){
                finish = true;
            }
        }else if(task.count){
            finish = true;
            for (var i = 0; i < task.count.length; i++) {
                if(Game.sugarPopCount[i] < task.count[i]){
                    finish = false;
                    break;
                }
            }
        }
        if(finish){
            this.ui.showSuccess();
            this.scheduleOnce(function(){
                Game.level++;
                cc.director.runScene(new GameScene());
            }, 3);
        }else{
            var sugarBombExploded = false;
            for (var i = 0; i < Constant.MAP_SIZE; i++) {
                for (var j = 0; j < Constant.MAP_SIZE; j++) {
                    if(this.map[i][j] && this.map[i][j] instanceof SugarBomb && this.map[i][j].isOver()){
                        sugarBombExploded = true;
                        break;
                    }
                }
            }
            var limit = Config.levels[Game.level].limit;
            if(sugarBombExploded || (limit.step && Game.steps > limit.step) || (!limit.step && limit.time && Game.timeElapsed > limit.time)){
                this.ui.showFail();
                this.scheduleOnce(function(){
                    cc.director.runScene(new GameScene());
                }, 3);
            }
        }
    },

    /**
     * 找到当前画面，随机一个颜色
     * @private
     */
    _findRandomSugarType: function () {
        var colorExist = [];
        for (var i = 0; i < Constant.MAP_SIZE; i++) {
            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                var o = this.map[i][j];
                if(o && o instanceof Sugar && !colorExist[o.type]){
                    colorExist.push(o.type);
                }
            }
        }
        return colorExist[parseInt(Math.random()*colorExist.length)];
    },

    traceSugars: function () {
        trace("============================")
        for (var i = Constant.MAP_SIZE - 1; i >= 0; i--) {        //deal each row
            var row = [];
            for (var j = 0; j < Constant.MAP_SIZE; j++) {
                row.push(this.map[j][i]?this.map[j][i].type:0);
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

