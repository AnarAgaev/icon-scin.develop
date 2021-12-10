$(document).ready(() => {
    window.initialProgressBar = () => {
        if ($('.visible .progress').length > 0) {
            let scroll = $(window).height() + $(window).scrollTop(),
                progress = $('.visible .progress'),
                bar = $(progress).find('.progress__bar'),
                top = $(progress).offset().top + $(progress).height();

            if (scroll > top && !bar.hasClass('progressed')) {
                $('.progress__bar').addClass('progressed');

                setTimeout(() => {
                    setProgressBar();
                    setProgressValue();
                }, 1300);
            }
        }
    };

    const setProgressBar = () => {
        const PI = 3.14,
            progress = $('.progress'),
            bar = progress.find('.progress__bar'),
            borderWidth = bar.attr('stroke-width'),
            circleRadius = (progress.width() - borderWidth) / 2,
            circleWidth = 2 * PI * circleRadius,
            from = $(progress).data('progressValueFrom'),
            too = $(progress).data('progressValueTo');

        bar.css('stroke-dasharray',
                `${circleWidth / 100 * from}, ${circleWidth}`)
           .css('stroke-dasharray',
               `${circleWidth / 100 * too}, ${circleWidth}`);

        setTimeout(() => {
            if ($('.visible .progress').length === 0) {
                $('.progress__bar').css('stroke-dasharray', '0, 999');
                // $('.progress .val').text(0);
            }
        }, 500);
    };

    window.removeProgressBar = () => {
        $('.progress__bar').removeClass('progressed');
    }

    const setProgressValue = () => {
        let progress = $('.visible .progress'),
            stop = $(progress).data('progressValueTo'),
            val = parseFloat($(progress).find('.val').text());

        if (stop) {
            if (val < stop) {
                let setValue = setInterval(countProgressUp, 50);

                function countProgressUp () {
                    if (val > stop - 1) {
                        window.clearInterval(setValue);
                    } else {
                        $('.progress__value .val').text(++val);
                    }
                }
            } else {
                let setValue = setInterval(countProgressDown, 50);

                function countProgressDown () {
                    if (val < stop + 1) {
                        window.clearInterval(setValue);
                    } else {
                        $('.progress__value .val').text(--val);
                    }
                }
            }
        } else {
            setTimeout(() => {
                if ($('.visible .progress').length === 0) {
                    $('.progress .val').text(0);
                }
            }, 500);
        }
    }

    initialProgressBar();
    $(window).scroll(initialProgressBar);
});