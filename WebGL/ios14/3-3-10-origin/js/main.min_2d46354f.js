var extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},__extends=function(e,t){function n(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__assign=Object.assign||function(e){for(var t,n=1,r=arguments.length;r>n;n++){t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},__rest=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n},__decorate=function(e,t,n,r){var o,a=arguments.length,i=3>a?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var u=e.length-1;u>=0;u--)(o=e[u])&&(i=(3>a?o(i):a>3?o(t,n,i):o(t,n))||i);return a>3&&i&&Object.defineProperty(t,n,i),i},__param=function(e,t){return function(n,r){t(n,r,e)}},__metadata=function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},__awaiter=function(e,t,n,r){function o(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,a){function i(e){try{c(r.next(e))}catch(t){a(t)}}function u(e){try{c(r["throw"](e))}catch(t){a(t)}}function c(e){e.done?n(e.value):o(e.value).then(i,u)}c((r=r.apply(e,t||[])).next())})},__generator=function(e,t){function n(e){return function(t){return r([e,t])}}function r(n){if(o)throw new TypeError("Generator is already executing.");for(;c;)try{if(o=1,a&&(i=2&n[0]?a["return"]:n[0]?a["throw"]||((i=a["return"])&&i.call(a),0):a.next)&&!(i=i.call(a,n[1])).done)return i;switch(a=0,i&&(n=[2&n[0],i.value]),n[0]){case 0:case 1:i=n;break;case 4:return c.label++,{value:n[1],done:!1};case 5:c.label++,a=n[1],n=[0];continue;case 7:n=c.ops.pop(),c.trys.pop();continue;default:if(i=c.trys,!(i=i.length>0&&i[i.length-1])&&(6===n[0]||2===n[0])){c=0;continue}if(3===n[0]&&(!i||n[1]>i[0]&&n[1]<i[3])){c.label=n[1];break}if(6===n[0]&&c.label<i[1]){c.label=i[1],i=n;break}if(i&&c.label<i[2]){c.label=i[2],c.ops.push(n);break}i[2]&&c.ops.pop(),c.trys.pop();continue}n=t.call(e,c)}catch(r){n=[6,r],a=0}finally{o=i=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}var o,a,i,u,c={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return u={next:n(0),"throw":n(1),"return":n(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u},__exportStar=function(e,t){for(var n in e)"default"===n||t.hasOwnProperty(n)||__createBinding(t,e,n)},__createBinding=Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]},__values=function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},__read=function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),i=[];try{for(;(void 0===t||t-->0)&&!(r=a.next()).done;)i.push(r.value)}catch(u){o={error:u}}finally{try{r&&!r.done&&(n=a["return"])&&n.call(a)}finally{if(o)throw o.error}}return i},__spread=function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(__read(arguments[t]));return e},__spreadArrays=function(){for(var e=0,t=0,n=arguments.length;n>t;t++)e+=arguments[t].length;for(var r=Array(e),o=0,t=0;n>t;t++)for(var a=arguments[t],i=0,u=a.length;u>i;i++,o++)r[o]=a[i];return r},__await=function(e){return this instanceof __await?(this.v=e,this):new __await(e)},__asyncGenerator=function(e,t,n){function r(e){l[e]&&(s[e]=function(t){return new Promise(function(n,r){f.push([e,t,n,r])>1||o(e,t)})})}function o(e,t){try{a(l[e](t))}catch(n){c(f[0][3],n)}}function a(e){e.value instanceof __await?Promise.resolve(e.value.v).then(i,u):c(f[0][2],e)}function i(e){o("next",e)}function u(e){o("throw",e)}function c(e,t){e(t),f.shift(),f.length&&o(f[0][0],f[0][1])}if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,l=n.apply(e,t||[]),f=[];return s={},r("next"),r("throw"),r("return"),s[Symbol.asyncIterator]=function(){return this},s},__asyncDelegator=function(e){function t(t,o){n[t]=e[t]?function(n){return(r=!r)?{value:__await(e[t](n)),done:"return"===t}:o?o(n):n}:o}var n,r;return n={},t("next"),t("throw",function(e){throw e}),t("return"),n[Symbol.iterator]=function(){return this},n},__asyncValues=function(e){function t(t){r[t]=e[t]&&function(r){return new Promise(function(o,a){r=e[t](r),n(o,a,r.done,r.value)})}}function n(e,t,n,r){Promise.resolve(r).then(function(t){e({value:t,done:n})},t)}if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,o=e[Symbol.asyncIterator];return o?o.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),r={},t("next"),t("throw"),t("return"),r[Symbol.asyncIterator]=function(){return this},r)},__makeTemplateObject=function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e},__setModuleDefault=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e["default"]=t},__importStar=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&__createBinding(t,e,n);return __setModuleDefault(t,e),t},__importDefault=function(e){return e&&e.__esModule?e:{"default":e}},__classPrivateFieldGet=function(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)},__classPrivateFieldSet=function(e,t,n){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,n),n},__reflect=function(e,t,n){e.__class__=t,n?n.push(t):n=[t],e.__types__=e.__types__?n.concat(e.__types__):n};!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(t){return e[t]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){n(1),n(2),n(3),n(4),n(5);var r=0;window.frameCount=r;var o=0;window.time=o;var a=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.imageList=[],t}return __extends(t,e),t.prototype.createChildren=function(){var t=this;e.prototype.createChildren.call(this),egret.lifecycle.addLifecycleListener(function(e){e.onUpdate=function(){t.imageList.forEach(function(e){e.rotation+=e.speedR,e.x+=e.speedX,e.y+=e.speedY,e.rotation+=e.speedR,(e.x>=440||e.x<=0)&&(e.speedX=-e.speedX),(e.y>=420||e.y<=0)&&(e.speedY=-e.speedY)})}});var n=new AssetAdapter;egret.registerImplementation("eui.IAssetAdapter",n),egret.registerImplementation("eui.IThemeAdapter",new ThemeAdapter),this.runGame()["catch"](function(e){console.log(e)})},t.prototype.runGame=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){switch(e.label){case 0:return[4,this.loadResource()];case 1:return e.sent(),this.createGameScene(),[2]}})})},t.prototype.loadResource=function(){return __awaiter(this,void 0,void 0,function(){var e,t;return __generator(this,function(n){switch(n.label){case 0:return n.trys.push([0,4,,5]),e=new LoadingUI,this.stage.addChild(e),[4,RES.loadConfig("resource/default.res.json","resource/")];case 1:return n.sent(),[4,this.loadTheme()];case 2:return n.sent(),[4,RES.loadGroup("preload",0,e)];case 3:return n.sent(),this.stage.removeChild(e),[3,5];case 4:return t=n.sent(),console.error(t),[3,5];case 5:return[2]}})})},t.prototype.loadTheme=function(){var e=this;return new Promise(function(t,n){var r=new eui.Theme("resource/default.thm.json",e.stage);r.addEventListener(eui.UIEvent.COMPLETE,function(){t()},e)})},t.prototype.createGameScene=function(){this.createBone(200)},t.prototype.createImage=function(e){this.imageList=[];for(var t=0;e>t;t++){var n=this.createBitmapByName("dance_png");n.x=500*Math.random(),n.y=500*Math.random(),n.speedX=10-20*Math.random(),n.speedY=10-20*Math.random(),n.alpha=1,n.speedR=Math.random()-.5,this.addChild(n),this.imageList.push(n)}},t.prototype.createBitmapByName=function(e){var t=new egret.Bitmap,n=RES.getRes(e);return t.texture=n,t},t.prototype.createBone=function(e){for(var t=0;e>t;t++){var n=new BoneJson;n.x=400*Math.random(),n.y=400*Math.random(),this.addChild(n)}},t}(eui.UILayer);window.Main=a,__reflect(a.prototype,"Main",[])},function(e,t){var n=function(){function e(){}return e.prototype.getAsset=function(e,t,n){function r(r){t.call(n,r,e)}if(RES.hasRes(e)){var o=RES.getRes(e);o?r(o):RES.getResAsync(e,r,this)}else RES.getResByUrl(e,r,this,RES.ResourceItem.TYPE_IMAGE)},e}();window.AssetAdapter=n,__reflect(n.prototype,"AssetAdapter",["eui.IAssetAdapter"])},function(e,t){var n=function(e){function t(){var t=e.call(this)||this,n=dragonBones.EgretFactory.factory,r=RES.getRes("bomb_ske_json"),o=RES.getRes("bomb_tex_json"),a=RES.getRes("bomb_tex_png");return n.parseDragonBonesData(r),n.parseTextureAtlasData(o,a),t.armatureDisplay=n.buildArmatureDisplay("bomb_fx"),t.armatureDisplay.animation.play("bomb_bom",1e3),t.armatureDisplay.once(dragonBones.EventObject.COMPLETE,function(){t.armatureDisplay.animation.play("bomb_bom",1)},t),t.addChild(t.armatureDisplay),t}return __extends(t,e),t.prototype.destoryMe=function(){this.armatureDisplay.animation.stop(),this.armatureDisplay.animation.reset(),this.armatureDisplay.dispose(),this.armatureDisplay=null,this.parent&&this.parent.removeChild(this)},t}(egret.DisplayObjectContainer);window.BoneJson=n,__reflect(n.prototype,"BoneJson",[])},function(e,t){var n=function(e){function t(){var t=e.call(this)||this;return t.createView(),t}return __extends(t,e),t.prototype.createView=function(){this.textField=new egret.TextField,this.addChild(this.textField),this.textField.y=300,this.textField.width=480,this.textField.height=100,this.textField.textAlign="center"},t.prototype.onProgress=function(e,t){this.textField.text="Loading..."+e+"/"+t},t}(egret.Sprite);window.LoadingUI=n,__reflect(n.prototype,"LoadingUI",["RES.PromiseTaskReporter"])},function(e,t){var n=function(){function e(){}return e.prototype.getUserInfo=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return[2,{nickName:"username"}]})})},e.prototype.login=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return[2]})})},e}();window.DebugPlatform=n,__reflect(n.prototype,"DebugPlatform",["Platform"]),window.platform||(window.platform=new n)},function(e,t){var n=function(){function e(){}return e.prototype.getTheme=function(e,t,n,r){function o(e){t.call(r,e)}function a(t){t.resItem.url==e&&(RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,a,null),n.call(r))}var i=this;if("undefined"!=typeof generateEUI)egret.callLater(function(){t.call(r,generateEUI)},this);else if("undefined"!=typeof generateEUI2)RES.getResByUrl("resource/gameEui.json",function(e,n){window.JSONParseClass.setData(e),egret.callLater(function(){t.call(r,generateEUI2)},i)},this,RES.ResourceItem.TYPE_JSON);else if("undefined"!=typeof generateJSON)if(e.indexOf(".exml")>-1){var u=e.split("/");u.pop();var c=u.join("/")+"_EUI.json";generateJSON.paths[e]?egret.callLater(function(){t.call(r,generateJSON.paths[e])},this):RES.getResByUrl(c,function(n){window.JSONParseClass.setData(n),egret.callLater(function(){t.call(r,generateJSON.paths[e])},i)},this,RES.ResourceItem.TYPE_JSON)}else egret.callLater(function(){t.call(r,generateJSON)},this);else RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,a,null),RES.getResByUrl(e,o,this,RES.ResourceItem.TYPE_TEXT)},e}();window.ThemeAdapter=n,__reflect(n.prototype,"ThemeAdapter",["eui.IThemeAdapter"])}]);