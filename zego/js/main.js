// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.smoothScroll').bind('click', function(event) {
        var $anchor = $(this);
        var target = $anchor.attr('href');
        target = target.substr(target.indexOf('#'));
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
        }, 600);
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});