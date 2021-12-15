$(document).ready(() => {
    window.initialProgressBar = (timeout = 1500) => {

        if ($('.visible .progress').length > 0
            && !$('body').hasClass('progress-counter-finished')) {

            let scroll = $(window).height() + $(window).scrollTop(),
                progress = $('.visible .progress'),
                bar = $(progress).find('.progress__bar'),
                top = $(progress).offset().top - 50; // + $(progress).height();

            if (scroll > top && !bar.hasClass('progressed')) {
                $('.progress__bar').addClass('progressed');

                setTimeout(() => {
                    setProgressBar();
                    setProgressValue();
                }, timeout);
            }
        }
    };

    initialProgressBar();

    $(window).scroll(() => initialProgressBar(700));

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
            }
        }, 500);
    };

    window.removeProgressBar = () => {
        $('.progress__bar').removeClass('progressed');
    }

    const setProgressValue = () => {
        let progress = $('.visible .progress'),
            stop = $(progress).data('progressValueTo');

        if (stop) {
            let val = window.toggleQuestionDirection
                ? progress.data('progressValueFrom')
                : progress.data('progressValueNext');

            countProgressValue(val, stop);
        } else {
            setTimeout(() => {
                if ($('.visible .progress').length === 0) {
                    $('.progress .val').text(0);
                }
            }, 500);
        }
    }

    const countProgressValue = (val, stop) => {
        if (val < stop) {
            let interval = setInterval(countProgressUp, 30);
            function countProgressUp () {
                if (val > stop - 1) {
                    window.clearInterval(interval);
                    setProgressValueCounted();
                } else {
                    $('.progress__value .val').text(++val);
                }
            }
        } else {
            let interval = setInterval(countProgressDown, 30);
            function countProgressDown () {
                if (val < stop + 1) {
                    window.clearInterval(interval);
                    setProgressValueCounted();
                } else {
                    $('.progress__value .val').text(--val);
                }
            }
        }
    }

    const setProgressValueCounted = () => {
        $('body').addClass('progress-counter-finished');
    }

    window.removeProgressValueCounted = () => {
        $('body').removeClass('progress-counter-finished');
    }
});