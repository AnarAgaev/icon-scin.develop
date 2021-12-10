$(document).ready(function () {
    let lastScrollTop;

    $(window).scroll(() => {
        ($(window).scrollTop() > lastScrollTop && 100 <= $(window).scrollTop())
            ? $('#header').addClass('hide')
            : $('#header').removeClass('hide');

        lastScrollTop = $(window).scrollTop();
    });
});