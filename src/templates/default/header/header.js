$(document).ready(function () {
    let lastScrollTop;

    $(window).scroll(() => {
        let scrollTop = $(window).scrollTop();


        (scrollTop > 100)
            ? $('#header').removeClass('blocked')
            : $('#header').addClass('blocked');

        (scrollTop > lastScrollTop)
            ? $('#header').addClass('hide')
            : $('#header').removeClass('hide');

        lastScrollTop = $(window).scrollTop();
    });
});