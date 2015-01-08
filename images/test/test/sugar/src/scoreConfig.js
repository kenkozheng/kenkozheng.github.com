/**
 * Created by Kenko on 2014/11/6.
 */

var specialSugarFactor = {};
specialSugarFactor[Constant.EFFECT_BIG_BOMB] = 1.1;     //巨大包装糖系数
specialSugarFactor[Constant.EFFECT_BOMB] = 1.1;         //炸弹
specialSugarFactor[Constant.EFFECT_COLORFUL] = 1.1;     //彩糖
specialSugarFactor[Constant.EFFECT_CROSS] = 1.1;        //十字条纹
specialSugarFactor[Constant.EFFECT_HORIZONTAL] = 1.1;   //横向条纹
specialSugarFactor[Constant.EFFECT_HORIZONTAL_BOMB] = 1.1;  //横向包装
specialSugarFactor[Constant.EFFECT_VERTICAL] = 1.1;         //竖向条纹
specialSugarFactor[Constant.EFFECT_VERTICAL_BOMB] = 1.1;    //竖向包装

var blockFactor = {};
blockFactor[Constant.MAP_FROSTING] = 1.1;       //糖霜系数
blockFactor[Constant.MAP_SUGAR_BOMB] = 1.1;     //糖果炸弹
blockFactor[Constant.MAP_SUGAR_LOCK] = 1.1;     //甘草锁
blockFactor[Constant.MAP_WHIRLPOOL] = 1.1;      //甘草漩涡

/**
 * @param sugarCount {Array} 每种糖果的数量（不包含彩糖）
 * @param specialSugarCount {Object} 特殊糖果的数量
 * @param blockCount {Object} 障碍物数量
 */
var calculateScore = function (sugarCount, specialSugarCount, blockCount) {
    var baseScore = 10;     //普通糖基本分数
    var score = 0;

    //先累计基础分数
    for (var i = 0; i < sugarCount.length; i++) {
        if(sugarCount[i] > 0){
            score += sugarCount[i] * baseScore;
        }
    }

    var totalFactor = 1;
    for (var key in specialSugarCount) {
        //如果这种特殊糖的数量大于0
        if(specialSugarCount[key] > 0){
            totalFactor = totalFactor * specialSugarFactor[key];     //取出这种障碍对应的系数，totalFactor越变越大
        }
    }
    for (var key in blockCount) {
        //如果这种障碍的数量大于0
        if(blockCount[key] > 0){
            totalFactor = totalFactor * blockFactor[key];
        }
    }

    return Math.round(score*totalFactor);
};
