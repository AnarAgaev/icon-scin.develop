$(document).ready(function () {
    let lastScrollTop;

    $(window).scroll(() => {

        if ($(window).width() < 768) {
            let scrollTop = $(window).scrollTop();

            (scrollTop > 100)
                ? $('#header').removeClass('blocked')
                : $('#header').addClass('blocked');

            (scrollTop > lastScrollTop)
                ? $('#header').addClass('hide')
                : $('#header').removeClass('hide');

            lastScrollTop = $(window).scrollTop();
        }

    });
});