$(document).ready(function () {
    let isUnlockedToggleStep = true;

    const blockedTimeout = 1300;

    const setMaxHeightToSteps = step => {
        const isInvisible = $(step).hasClass('hidden');

        $(step).removeClass('hidden');
        $(step).css('maxHeight', $(step).height());
        if (isInvisible) $(step).addClass('hidden');
    }

    // Инициализируем максимальную высоты
    // во всех шагах для плавной анимации
    $('.step').each((idx, el) => setMaxHeightToSteps(el));

    // Обрабатываем клик по кнопке вперёд
    $('.btn_next-step').each((idx, el) => {
        $(el).click(
            e => handlerBtnToggleStep(
                e.target,
                true
            )
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
            blockToggleSteps();

            const thisStep = $(btn).closest('.step'),
                nextStep = $(`#${ $(thisStep).data('nextStepId') }`),
                prevStep = $(`#${ $(thisStep).data('prevStepId') }`);

            invisibleEl(thisStep);

            if (direction) {
                showEl(nextStep);
                visibleEl(nextStep);
                replaceEl(nextStep);
            } else {
                showEl(prevStep);
                visibleEl(prevStep);
                replaceEl(prevStep);
            }

            hideEl(thisStep);
            unblockToggleSteps();
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
                const progressBar = $('#progressBar')[0];
                progressBar.after(el[0]);
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
});