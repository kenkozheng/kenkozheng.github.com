/**
 * Created by Kenko on 2014/9/14.
 */

var Constant = {
    SUGAR_WIDTH: 64,
    MAP_SIZE: 10,
    FALL_ACCELERATION: 30,

    STATUS_CHOSEN: 1,
    STATUS_NORMAL: 0,
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

    MAP_SUGAR: 0,
    MAP_BLANK_HOLE: 1,
    MAP_BLOCK: 2,

    levels: [
        {score: 100000, map: [
            [0,0,1,1,1,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,0,0],
            [0,0,2,0,0,1,1,1,0,0],
            [0,0,2,0,0,0,1,1,1,0],
            [0,1,1,1,0,0,0,0,0,0],
            [0,2,0,0,1,1,1,0,0,0],
            [0,0,1,1,1,0,0,0,0,0],
            [1,1,1,0,0,0,2,0,0,0],
            [0,0,0,0,1,1,1,0,0,0],
            [0,0,1,1,1,0,0,0,0,0],
        ]}
    ]
};