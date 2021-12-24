$(document).ready(() => {
    $('[data-toggle="modal"]').click(e => {
        showModal(e.target);
    });

    window.showModal = function (el) {

        let modal = $(el).data('target'),
            video = $(modal).find('video')[0];

        $(modal).addClass('show');
        if (video) video.play();
    }

    $('.modal').click(e => {
       if (isActionNode(e.target)) {
           hideModal(e.target);
       }
    });

    const hideModal = function (el) {
        let modal = $(el).closest('.modal'),
            video = $(modal).find('video')[0],
            dialogs = $(modal).find('.modal__dialog');

        if (video) {
            video.pause();
            video.currentTime = 0;
        }

        modal.removeClass('show');

        // Если в модальном окне несколько диалоговых окно,
        // оставляем видимым только первое
        if (dialogs.length > 1) {

            setTimeout(e => {
                $(dialogs[0])
                    .removeClass('modal__dialog_hide hidden');

                dialogs
                    .filter(idx => idx > 0)
                    .addClass('modal__dialog_hide hidden');
            }, 500);
        }
    }

    const isActionNode = function (el) {
        return $(el).hasClass('modal')
            || $(el).hasClass('modal__close');
    }

    $('.__openModalShare').on(
        'click',
        e => {
            let _this = e.target;

            if (isModal(_this)) {
                let timeout = 400,
                    modal = $(_this).closest('.modal'),
                    thisDialog = $(_this).closest('.modal__dialog'),
                    resultsDialog = $(modal).find('.modal__dialog_results');

                thisDialog.addClass('modal__dialog_hide');

                setTimeout(e => {
                    thisDialog.addClass('hidden');
                    resultsDialog.removeClass('hidden');
                }, timeout);

                setTimeout(
                    e => resultsDialog.removeClass('modal__dialog_hide'),
                    timeout + 100
                );
            } else {
                showModal(_this);
            }
        }
    );

    const isModal = (el) => {
        return $(el).closest('.modal').length > 0;
    }

    // Копируем URL в буфер
    $('.__copyUrl').click(copyURL);
});