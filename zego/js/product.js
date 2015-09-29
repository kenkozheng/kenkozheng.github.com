/**
 * Created by kenkozheng on 2015/9/29.
 */

$(function () {
    function onResize(){
        $('.product-desc').height($('.product-desc').width()/2560*1440-30);
    }

    $(window).resize(onResize);
    onResize();
});