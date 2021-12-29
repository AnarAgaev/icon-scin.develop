$(document).ready(function () {
    let lastScrollTop;

    $(window).scroll(() => {

        if ($(window).width() < 768) {
            let scrollTop = $(window).scrollTop(),
                firstScreenHeight = $('#firstScreen').height();

            console.log();

            (scrollTop > 100 & scrollTop < firstScreenHeight)
                ? $('#header').removeClass('blocked')
                : $('#header').addClass('blocked');

            (scrollTop > lastScrollTop)
                ? $('#header').addClass('hide')
                : $('#header').removeClass('hide');

            lastScrollTop = $(window).scrollTop();
        }

    });
});