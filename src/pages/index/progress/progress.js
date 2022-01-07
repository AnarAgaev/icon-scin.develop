let progressValueInterval;

$(document).ready(() => {

    window.initialProgressBar = (timeout = 1000) => {

        if ($('.visible .progress').length > 0
            && !$('body').hasClass('progress-counter-finished')) {

            let scroll = $(window).height() + $(window).scrollTop(),
                progress = $('.visible .progress'),
                top = $(progress).offset().top; // - 30 + $(progress).height();

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
        // Чистим интервал, на тот случай если
        // пользователь перешёл на следующий/предыдущий
        // вопрос, не доздавшись завершения пересчёта
        // прогресс бара
        if (progressValueInterval) clearInterval(progressValueInterval)

        if (val < stop) {
            progressValueInterval = setInterval(countProgressUp, 33);
            function countProgressUp () {
                if (val > stop - 1) {
                    clearInterval(progressValueInterval);
                    setProgressValueCounted();
                } else {
                    $('.progress__value .val').text(++val);
                }
            }
        } else {
            progressValueInterval = setInterval(countProgressDown, 33);
            function countProgressDown () {
                if (val < stop + 1) {
                    clearInterval(progressValueInterval);
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