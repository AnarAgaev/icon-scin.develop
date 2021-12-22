window.toggleQuestionDirection = undefined;

$(document).ready(function () {

    let isUnlockedToggleStep = true;

    const blockedTimeout = 1300;

    const setMaxHeightToSteps = step => {
        const isInvisible = $(step).hasClass('hidden');

        $(step).removeClass('hidden');
        $(step).css('maxHeight', $(step).height() + 100);
        if (isInvisible) $(step).addClass('hidden');
    }

    // Инициализируем максимальную высоту
    // во всех шагах для плавной анимации
    $('.step').each((idx, el) => setMaxHeightToSteps(el));

    // Обрабатываем клик по кнопке вперёд
    $('.btn_next-step').each((idx, el) => {
        $(el).click(
            e => {
                let _this = e.target;

                if (!$(_this).data('nextStepId')) {
                    _this = $(_this).closest('.btn');
                }

                setTimeout(e => handlerBtnToggleStep (
                    _this,
                    true
                ), 300);
            }
        );
    });

    // Обрабатываем клик по кнопке назад
    $('.btn_prev-step').each((idx, el) => {
        $(el).click(
            e => handlerBtnToggleStep(
                e.target,
                false
            )
        );
    });

    const handlerBtnToggleStep = (btn, direction) => {
        if (isUnlockedToggleStep) {
            window.toggleQuestionDirection = direction;

            blockToggleSteps();
            blockHeaderToggle();
            removeProgressBar();
            removeProgressValueCounted();
            setTimeout(initialProgressBar, 300);

            let thisStep = $(btn).closest('.step'),
                nextStepId = $(btn).data('nextStepId'),
                nextStep = $(nextStepId),
                prevStepId = STORE.stepsMap[STORE.stepsMap.length - 2],
                prevStep = $(prevStepId);



            // Для пооследнего вопроса перезаписываем следующий шаг,
            // т.к. до прохождения квиза результат не известен.
            // В последний шаг записываем карточку, рссчитанную
            // в функции getResultCard

            console.log('nextStepId', nextStepId)

            if (nextStepId === '#showResult') {
                hideQuestionsCaption();

                nextStep = getResultCard();
            }

            invisibleEl(thisStep);

            if (direction) {
                toggleFirstScreen(nextStep);
                showEl(nextStep);
                visibleEl(nextStep);
                replaceEl(nextStep);
                pushStepToStepsMap(nextStep);
            } else {
                toggleFirstScreen(prevStep);
                showEl(prevStep);
                visibleEl(prevStep);
                replaceEl(prevStep);
                removeLastStepFromStepsMap();
                resetAllControllers();

                // Удаляем ТЕКУЩИЕ ответы из STORE на тот случаей
                // елси ПЕРЕШЛИ НАЗАД ИЗ ВОПРОСА с множественными
                // ответами (с кнопкой Далее)
                resetAnswer(thisStep);

                // Удаляем ПРЕДЫДУЩИЕ ответы из STORE на тот случаей
                // елси ПЕРЕШЛИ НА ВОПРОС с множественными
                // ответами (с кнопкой Далее)
                resetAnswer(prevStep);
                hideNextButtonWrapper();
            }

            hideEl(thisStep);
            scrollToActiveQuestion();
            unblockToggleSteps();
            unblockHeaderToggle();
        }
    }

    const hideQuestionsCaption = () => {
        $('#questionsCaption').addClass('questions-caption__wrap_invisible');
    }

    const toggleFirstScreen = (el) => {

        let firstScreen = $('#firstScreen'),
            isFirstQuestion = $(el).attr('id') === 'questionFirst',
            isQuestionRestrictions = $(el).attr('id') === 'questionRestrictions',
            isFirstScreenVisible = !firstScreen
                .hasClass('first-screen_invisible');

        if (isFirstQuestion && isFirstScreenVisible) {
            firstScreen.addClass('first-screen_invisible');
            return;
        }

        if(isQuestionRestrictions && !isFirstScreenVisible) {
            firstScreen.removeClass('first-screen_invisible');
        }
    }

    const invisibleEl = el => {
        el.addClass('collapsed');
    }

    const showEl = el => {
        el.removeClass('hidden');
    }

    const visibleEl = el => {
        setTimeout(
            () => el.addClass('visible'),
            200
        );
    }

    const hideEl = el => {
        setTimeout(
            () => {
                el.removeClass('visible collapsed')
                    .addClass('hidden');
            },
            blockedTimeout
        )
    }

    const replaceEl = el => {
        setTimeout(
            () => {
                const activeQuestionPlace = $('#activeQuestionPlace')[0];
                activeQuestionPlace.after(el[0]);
            },
            blockedTimeout
        )
    }

    const blockToggleSteps = () => {
        isUnlockedToggleStep = false;
    }

    const unblockToggleSteps = () => {
        setTimeout(
            () => {
                isUnlockedToggleStep = true;
            },
            blockedTimeout
        )
    }

    const scrollToActiveQuestion = () => {
        setTimeout(e => {
            let top = $('#questionsCaption .questions-caption').offset().top;

            $('body,html').animate(
                { scrollTop: top },
                1000
            );
        }, 700);
    }

    const pushStepToStepsMap = (el) => {
        let id = $(el).attr('id');
        STORE.stepsMap.push(`#${id}`);
    }

    const removeLastStepFromStepsMap = () => {
        STORE.stepsMap.splice(-1, 1);
    }

    const resetAllControllers = () => {
        $('input.controller').prop('checked', false);
    }

    const resetAnswer = (el) => {
        let prop = $(el).find('.controller').attr('name');
        delete STORE[prop];
    }

    const blockHeaderToggle = () => {
        $('#header').addClass('hide');

        setTimeout(
            () => $('#header').addClass('hidden'),
            300
        );
    }

    const unblockHeaderToggle = () => {
        setTimeout(
            () => {
                $('#header')
                    .addClass('hide')
                    .removeClass('hidden');
            },
            3000
        );
    }

    // Показываем кнопку Далле и Показать результаты
    $('.controller_btn-next').on('input', e => showNextButton(e));

    const showNextButton = e => {
        let step = $(e.target).closest('.step'),
            maxHeight = parseFloat(step.css('maxHeight')) + 100,
            btnWrap = $(step).find('.btn-next-step__wrap');

        blockHeaderToggle();

        step.css('maxHeight', maxHeight + 'px');
        btnWrap.addClass('show');

        unblockHeaderToggle();
    }

    // Скрываем кнопку Далле и Показать результаты
    const hideNextButtonWrapper = () => {
        $('.btn-next-step__wrap').removeClass('show');
    }










    // Рассчитваем резьльтаты прохождения Квиза
    // и определяем какую блок результатов показывать
    const getResultCard = () => {
        return $('#result-1');
    }
});