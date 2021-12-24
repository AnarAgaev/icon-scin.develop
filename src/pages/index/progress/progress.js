$(document).ready(() => {

    // // Инициализируем все круговые прогрессы
    // (function initProgressCircles () {
    //     const circle = document.querySelector('.progress__circle'),
    //         radius = circle.r.baseVal.value,
    //         circumference = 2 * Math.PI * radius;
    //
    //     $('.progress__circle').css({
    //         "strokeDasharray": `${circumference} ${circumference}`,
    //         "strokeDashoffset": circumference
    //     });
    // })();


    window.initialProgressBar = (timeout = 1000) => {

        if ($('.visible .progress').length > 0
            && !$('body').hasClass('progress-counter-finished')) {

            let scroll = $(window).height() + $(window).scrollTop(),
                progress = $('.visible .progress'),
                top = $(progress).offset().top - 30; // + $(progress).height();

            if (scroll > top) {
                setTimeout(() => {
                    setProgressBar();
                    setProgressValue();
                }, timeout);
            }
        }
    };

    $(window).scroll(() => initialProgressBar(300));

    const setProgressBar = () => {
        setTimeout(() => {
            const progress = $('.visible .progress'),
                percent = $(progress).data('progressValueTo'),
                // circle = progress.find('.progress__circle')[0],
                // radius = circle.r.baseVal.value,
                radius = 40,
                circumference = 2 * Math.PI * radius,
                offset = circumference - percent / 100 * circumference;

            $('.progress__circle').css('strokeDashoffset', offset);
        }, 400);
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