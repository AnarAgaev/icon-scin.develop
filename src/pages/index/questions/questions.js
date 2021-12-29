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

            console.log(nextStepId)

            // Загружаем картинки для следуещего вопроса
            if (nextStepId === '#questionRestrictions'
                    || nextStepId === '#questionFirst'
                    || nextStepId === '#questionSecond'
                    || nextStepId === '#questionThird'
                    || nextStepId === '#questionFourth'
                    || nextStepId === '#questionFifthOne'
                    || nextStepId === '#questionFifthTwo'
                    || nextStepId === '#questionSixth'
                    || nextStepId === '#questionSeventh') {

                // Загружаем картинки для вопроса
                uploadQuestionsPics(nextStepId);

                // Загружаем картинки протоколов
                uploadQuestionsProtocolsPics();
            }

            // Для пооследнего вопроса перезаписываем следующий шаг,
            // т.к. до прохождения квиза результат не известен.
            // В последний шаг записываем карточку, рссчитанную
            // в функции getResultCard
            if (nextStepId === '#showResult') {
                hideQuestionsCaption();

                nextStep = getResultCard();
                const resSectionId = $(nextStep).attr('id');

                // Загружаем картинки в результатх
                uploadResPics(resSectionId);

                // Загружаем картинки в отзывыж
                uploadReviewsPics();

                // Проверяем нужны ли препараты для спины и постакне
                // Если не нужен ни один из препаратов поправляем
                // отсут у кнопки Где купить набор со скидкой
                // Обе функции и checkBack и checkPostAcne
                // возвращают true если препарат нужен иначе false
                let back = checkBack();
                let postAcne = checkPostAcne();

                if (IS_DEBUGGING) postAcne
                    ? console.log('Нужен ли препарат от Постакне:', 'Да')
                    : console.log('Нужен ли препарат от Постакне:', 'Нет');

                if (IS_DEBUGGING) back
                    ? console.log('Нужен ли препарат для Сины:', 'Да')
                    : console.log('Нужен ли препарат для Сины:', 'Нет');

                if (!back && !postAcne) {
                    $('._whereBuyBtn').css('paddingTop', '30px');
                }

                // Проверяем результат (постакне и спина)
                // и добавляем ссылку на подобраный набор
                // препаратов на сайте заказчика
                let vendorLink = templateURL;

                if (!back && !postAcne) {
                    vendorLink += resultLinks[resSectionId]['without'];
                    setVendorLink(vendorLink);

                    if (IS_DEBUGGING)
                        console.log('Ссылка на набор без доп. препаратов: ', vendorLink);

                } else if (!back && postAcne) {
                    vendorLink += resultLinks[resSectionId]['acne'];
                    setVendorLink(vendorLink);

                    if (IS_DEBUGGING)
                        console.log('Ссылка на набор с ПостАкне: ', vendorLink);

                } else if (back && !postAcne) {
                    vendorLink += resultLinks[resSectionId]['back'];
                    setVendorLink(vendorLink);

                    if (IS_DEBUGGING)
                        console.log('Ссылка на набор с препоратом для спины: ', vendorLink);

                }  else if (back && postAcne) {
                    vendorLink += resultLinks[resSectionId]['acne_back'];
                    setVendorLink(vendorLink);

                    if (IS_DEBUGGING)
                        console.log('Ссылка на набор с препоратом для спины и с ПостАкне: ', vendorLink);

                }
            }

            // Для блока до 18 лет, меняем ссылка на набор
            // на сайте заказчика
            //
            // Также загружаем картинки для блока до 18 лет
            if (nextStepId === '#resultBefore18') {
                $('._vendorLink').attr('href', templateURL + '21');
                // Загружаем картинки в результатх
                uploadResPics('resultBefore18');

                // Загружаем картинки протоколов
                uploadQuestionsProtocolsPics();

                // Загружаем картинки в отзывыж
                uploadReviewsPics();
            }

            // Загружаем картинки для блока Терапии
            if (nextStepId === '#resultTherapy') {
                // Загружаем картинки протоколов
                uploadQuestionsProtocolsPics();

                // Загружаем картинки в отзывыж
                uploadReviewsPics();
            }

            invisibleEl(thisStep);

            if (direction) {
                toggleFirstScreen(nextStep);
                togglePageHeader(nextStep);
                showEl(nextStep);
                visibleEl(nextStep);
                replaceEl(nextStep);
                pushStepToStepsMap(nextStep);
            } else {
                toggleFirstScreen(prevStep);
                togglePageHeader(prevStep);
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
        $('#questionsCaption')
            .addClass('questions-caption__wrap_invisible');
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

    const togglePageHeader = (el) => {
        let header = $('#header'),
            isFirstQuestion = $(el).attr('id') === 'questionFirst',
            isQuestionRestrictions = $(el).attr('id') === 'questionRestrictions',
            isHeaderVisible = !header
                .hasClass('header_invisible');

        if (isFirstQuestion && isHeaderVisible) {
            header.addClass('header_invisible');
            return;
        }

        if(isQuestionRestrictions && !isHeaderVisible) {
            header.removeClass('blocked header_invisible');

            setTimeout(
                () => header.removeClass('hidden'),
                10
            );
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
        if ($(window).width() < 768) {
            $('#header').addClass('hide');

            setTimeout(
                () => $('#header').addClass('hidden'),
                300
            );
        }
    }

    const unblockHeaderToggle = () => {
        if ($(window).width() < 768) {
            setTimeout(
                () => {
                    $('#header')
                        .addClass('hide')
                        .removeClass('hidden');
                },
                3000
            );
        }
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

    const setVendorLink = link => {
        $('._vendorLink').attr('href', link);
    }

    // Загружаем картинки для вопросов
    const uploadQuestionsPics = (id) => {
        $(id + ' .form-question__pic[data-src]')
            .each((idx, el) => {
                let source = $(el).data('src');
                $(el).css('background-image', `url(${source})`);
            });
    }

    // Загружаем картинки с протоколами для вопросов
    const uploadQuestionsProtocolsPics = () => {
        $('.protocols[data-src]')
            .each((idx, el) => {
                let source = $(el).data('src');
                $(el).attr('src', source);
            });
    }

    // Загружаем картинки в результатах
    const uploadResPics = (id) => {
        $('#'+id+' .res-picture[data-src]')
            .each((idx, el) => {
                let source = $(el).data('src');
                $(el).attr('src', source);
            });
    }

    // Загружаем картинки для отзывов
    const uploadReviewsPics = () => {

        // Картинки внутри отзыва
        $('.reviews[data-src]')
            .each((idx, el) => {
                let source = $(el).data('src');
                $(el).attr('src', source);
            });

        // Иконка отозвавшегося
        $('.pic_reviews[data-src]')
            .each((idx, el) => {
                let source = $(el).data('src');
                $(el).css('background-image', `url(${source})`);
            });
    }



    setTimeout(() => {
            // uploadQuestionsPics();
        },
        2000
    );

});