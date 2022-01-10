let progressValueInterval,
    progressCurrentValue = 0;

const PERCENTS = {
    '#questionRestrictions': 0,
    '#questionFirst': 15,
    '#questionSecond': 30,
    '#questionThird': 45,
    '#questionFourth': 60,
    '#questionFifthOne': 75,
    '#questionFifthTwo': 75,
    '#questionSixth': 90,
    '#questionSeventh': 100,
};

$(document).ready(() => {

    window.initialProgressBar = (timeout = 1000) => {

        if ($('.visible .progress').length > 0) {

            let scroll = $(window).height() + $(window).scrollTop(),
                progress = $('.visible .progress'),
                top = $(progress).offset().top;

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

            // const progress = $('.visible .progress'),
            //     percent = $(progress).data('progressValueTo'),
            //     // circle = progress.find('.progress__circle')[0],
            //     // radius = circle.r.baseVal.value,
            //     radius = 40,
            //     circumference = 2 * Math.PI * radius,
            //     offset = circumference - percent / 100 * circumference;

            // $('.progress__circle').css('strokeDashoffset', offset);

            setCurrentStepInBody();
        }, 300);
    };

    const setCurrentStepInBody = () => {
        
        const body = document.querySelector('body'),
            currentStep = STORE.stepsMap[STORE.stepsMap.length - 1];
        
            body.dataset.currentStep = currentStep;
    };

    const setProgressValue = () => {
        setTimeout(() => {      
            if (!isProgressValProcessing()) {
                
                let step = STORE.stepsMap[STORE.stepsMap.length - 1],
                    percent = PERCENTS[step];
                    
                setProgressValProcessing();          
                    
                countProgressValue(percent);         
            }
        }, 300);
    };

    const countProgressValue = (stop) => {

        /* Чистим интервал, на тот случай если
         * пользователь перешёл на следующий/предыдущий
         * вопрос, не дождавшись завершения пересчёта
         * прогресс бара
         */
        if (progressValueInterval) clearInterval(progressValueInterval);
        

        function countProgressUp () {
            progressCurrentValue > stop - 1
                ? clearInterval(progressValueInterval)
                : $('.progress__value .val').text(++progressCurrentValue);
        }

        function countProgressDown () {
            progressCurrentValue < stop + 1
                ? clearInterval(progressValueInterval)
                : $('.progress__value .val').text(--progressCurrentValue);
        }

        progressValueInterval = progressCurrentValue < stop
            ? setInterval(countProgressUp, 33)
            : setInterval(countProgressDown, 33);      
    };

    const isProgressValProcessing = () => {
        return $('body').hasClass('progress-value-is-processing');
    };

    const setProgressValProcessing = () => {
        $('body').addClass('progress-value-is-processing');
    };

    window.removeProgressValueCalculater = () => {
        $('body')
            .removeClass('progress-value-is-processing');
    };
});