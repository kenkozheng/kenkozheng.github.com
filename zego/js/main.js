$(function () {
    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    });

    //导航栏的平滑滚动
    $('a.smoothScroll').bind('click', function (event) {
        var $anchor = $(this);
        var target = $anchor.attr('href');
        target = target.substr(target.indexOf('#'));
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
        }, 600);
        event.preventDefault();
    });
});


// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function () {
    $('.navbar-toggle:visible').click();
});


//视频预加载
var iframe = $('#video iframe');
var src = 'http://yuntv.letv.com/bcloud.html?uu=jjqqxpnhli&vu=7037e8b840&pu=cf777f3f47&auto_play=1&gpcflag=1&width=' + iframe.width() + '&height=' + iframe.height();
iframe.attr('src', src + '&auto_play=0');


//点击播放后视频立即播放，手机侧无法理解播放，受安全限制
$('#videoBtn').on('click', function () {
    iframe.attr('src', src + '&auto_play=1');
});