/**
 * Created by Kenko on 2014/9/14.
 */

var Constant = {
    SUGAR_WIDTH: 72,
    SUGAR_TYPE_COUNT: 5,
    MAP_SIZE: 10,
    FALL_ACCELERATION: 30,

    STATUS_NORMAL: 0,
    STATUS_CHOSEN: 1,
    /**
     * 用于计算生成什么特殊糖的时候，临时用到
     */
    STATUS_DELETE: 2,

    EFFECT_NONE: 0,
    EFFECT_HORIZONTAL: 1,
    EFFECT_VERTICAL: 2,
    EFFECT_BOMB: 3,
    EFFECT_COLORFUL: 4,
    EFFECT_BIG_BOMB: 5,
    /**
     * 横竖
     */
    EFFECT_CROSS: 6,
    /**
     * 条纹包装糖
     */
    EFFECT_HORIZONTAL_BOMB: 7,
    EFFECT_VERTICAL_BOMB: 8,

    /**
     * 地图元素类型
     */
    MAP_SUGAR: 0,
    MAP_BLANK_HOLE: 1,
    MAP_SUGAR_BOMB: 2,
    MAP_FROSTING: 3,
    MAP_WHIRLPOOL: 4,
    MAP_SUGAR_LOCK: 5,
    MAP_CHOCOLATE: 6,
    MAP_CHOCOLATE_MACHINE: 7,

    /**
     * 道具类型，从1开始
     */
    PROP_HAMMER: 1,
    PROP_ROCKET: 2,
    PROP_MORE_TIME: 3,
    PROP_MORE_STEP: 4,

    PROP_HAMMER_RANGE: 1,
    PROP_MORE_STEP_COUNT: 3,
    PROP_MORE_TIME_COUNT: 20
};