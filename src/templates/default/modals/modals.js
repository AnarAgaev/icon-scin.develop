$(document).ready(() => {
    $('[data-toggle="modal"]').click(e => {
        showModal(e.target);
    });

    const showModal = function (_this) {
        let modal = $(_this).data('target'),
            video = $(modal).find('video')[0];

        $(modal).addClass('show');
        if (video) video.play();
    }

    $('.modal').click(e => {
       if (isActionNode(e.target)) {
           hideModal(e.target);
       }
    });

    const hideModal = function (_this) {
        let modal = $(_this).closest('.modal'),
            video = $(modal).find('video')[0];
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

    const isActionNode = function (_this) {
        return $(_this).hasClass('modal')
            || $(_this).hasClass('modal__close');
    }
});