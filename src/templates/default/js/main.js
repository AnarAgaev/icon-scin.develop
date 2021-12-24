// Блокируем зум экрана на IOS
document.addEventListener(
    'touchmove',
    function(event) {
        event = event.originalEvent || event;

        if (event.scale !== 1) {
            event.preventDefault();
        }
    },
    false
);

window.IS_DEBUGGING = true;

window.validatePhone = (phone = STORE.phone) => {
    let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
    return regular.test(phone);
};

window.validateEmail = (email = STORE.email) => {
    // Регулярка для email проверяет только
    // наличие @ и точки
    let regular = /.+@.+\..+/i;
    return regular.test(email);
};

window.copyURL = () => {
    $("body").append('<input id="copyURL" type="text" value="" />');
    $("#copyURL").val(window.location.href).select();
    document.execCommand("copy");
    $("#copyURL").remove();
}

// В суперглобальной переменной храним
// все дынные, введенные пользователем
window.STORE = {
    connect: "WhatsApp",
    stepsMap: [
        '#questionAge',

    ]
};

// С помощью проксирования слушаем
// изменение структуры данных
STORE = new Proxy(STORE, {
    set: function (target, prop, val) {

        const removeAnswerFromStore = ([question, answer]) => {
            let prop = getPropFromController(question, answer),
                arrAnswers = target[prop][1],
                idxOfAnswer = arrAnswers.indexOf(answer);

            arrAnswers.splice(idxOfAnswer, 1);

            if (arrAnswers.length === 0) {
                setTimeout(
                    () => $('.btn-next-step__wrap.show').removeClass('show'),
                    300
                );
            }
        }

        const addAnswerToStore = ([question, answer]) => {
            let prop = getPropFromController(question, answer);

            target[prop]
                ? target[prop][1].push(answer)
                : target[prop] = [question, [answer]];
        }

        if (isPluralController(val)) {
            // Если в STORE уже есть целевой ответ,
            // удаляем его, иначе добавляем
            isAnswerInStore(val)
                ? removeAnswerFromStore(val)
                : addAnswerToStore(val);
        } else {
            target[prop] = val;
        }

        /*
         * Если в СТОРЕ меняется телефон, то сразу меняем
         * телефон во всех полях ввода телефона.
         */
        if (prop === 'phone') {
            updatePhones(val);
        }

        /*
         * Если в СТОРЕ меняется email, то сразу меняем
         * email во всех полях ввода email адреса.
         */
        if (prop === 'email') {
            updateEmails(val);
        }

        if (IS_DEBUGGING) {
            setTimeout(() => console.log(target), 100);
        }

        return true;
    },

    deleteProperty: function(target, prop) {
        delete target[prop];

        if (IS_DEBUGGING) {
            setTimeout(() => console.log(target), 100);
        }

        return true;
    }
});

const isPluralController = ([question, answer]) => {
    return $(`[data-question="${question}"][data-answer="${answer}"]`)
        .attr('type') === 'checkbox';
}

const isAnswerInStore = ([question, answer]) => {
    let prop = getPropFromController(question, answer);

    if (STORE[prop]) {
        return STORE[prop][1].includes(answer);
    }
}

const getPropFromController = (question, answer) => {
    return $(`[data-question="${question}"][data-answer="${answer}"]`)
        .attr('name');
}

// Маски для всех телефонов сохраняем
// в отдельный суперглобальный массив
const PHONE_MASKS = [];

// Маска для телефона одинакова
// для всех телефонов
const phoneMaskOptions = {
    mask: '+{7} ({9}00) 000-00-00',
    lazy: true,
    placeholderChar: '_'
};

// Котроллеры для телефонов - взаимозависимые поля
const updatePhones = (phone) => {
    $(PHONE_MASKS).each(
        idx => PHONE_MASKS[idx].unmaskedValue = phone
    );
}

// Котроллеры для телефонов - взаимозависимые поля
const updateEmails = (email) => {
    $('[type="email"]').val(email);
}

// Если телефон валидный,
// разлокируем кнопки отправки формы
const checkPhones = () => {
    $('[type="tel"]')
        .closest('form')
        .find('[type="submit"]')
        .prop({
            disabled: !validatePhone(STORE.phone)
        });
}

// Если email валидный, разблокируем
// кнопки отправки формы
const checkEmail = () => {
    $('[type="email"]')
        .closest('form')
        .find('[type="submit"]')
        .prop({
            disabled: !validateEmail(STORE.email)
        });
}

$(document).ready(() => {

    /* Вешаем маску на контроллер каждого телефона
     * и сохраняем все маски в массив PHONE_MASKS
     *
     * Также на каждом контроллере телефона
     * обрабатываетс события фокус, потеря фокуса
     * и изменение значения
     *
     */

    const initialPhoneMasks = (idx, el) => {
        PHONE_MASKS.push(IMask(el, phoneMaskOptions));
        el.dataset.maskIdx = idx.toString();
    }

    const handlerPhoneFocus = e => {
        const _this = e.target,
            idx = $(_this).data('maskIdx');

        PHONE_MASKS[idx].updateOptions({
            lazy: false,
        });
    }

    const handlerPhoneBlur = e => {
        const _this = e.target,
            idx = $(_this).data('maskIdx');

        PHONE_MASKS[idx].updateOptions({
            lazy: true,
        });

        if (!validatePhone()) {
            STORE.phone = ''; // Нужно для организации взаимозависимых полей
            delete STORE.phone;
        }
    }

    const handlerPhoneInput = e => {
        const _this = e.target,
            idx = $(_this).data('maskIdx');

        STORE['phone'] = PHONE_MASKS[idx].unmaskedValue;
        checkPhones();
    }

    $('[type="tel"]')
        .each(initialPhoneMasks)
        .on('focus', handlerPhoneFocus)
        .on('blur', handlerPhoneBlur)
        .on('input', handlerPhoneInput);

    const handlerEmailInput = e => {
        STORE['email'] = $(e.target).val();
        checkEmail();
    }

    const handlerEmailBlur = e => {
        if (!validateEmail()) {
            STORE.email = ''; // Нужно для организации взаимозависимых полей
            delete STORE.email;
        }
    }

    $('[type="email"]')
        .on('blur', handlerEmailBlur)
        .on('input', handlerEmailInput);

    /* Слушаем изменение каждого input
     * В случае всплытия события,
     * пушим данные в STORE
     *
     */

    $('input.controller').on('input', e => {
        let _this = e.target,
            prop = $(_this).attr('name'),
            question = $(_this).data('question'),
            answer = $(_this).data('answer');

        STORE[prop] = [question, answer];

        removeProgressBar();
        setTimeout(initialProgressBar, 300);
        resetAllCheckboxControllers(_this);
    });

    const resetAllCheckboxControllers = (el) => {
        if ($(el).attr('type') === 'radio') {
            $('input:checkbox').prop('checked', false);
        }
    }

    // Скролл к первому вопросу
    $('.go-to-quiz').click(() => {
        let top = $('#questionsCaption .questions-caption').offset().top;

        $('body,html').animate(
            { scrollTop: top },
            1000
        );
    });

    // Сбрасываем весь квиз
    const fullReset = () => {

        // Сбрасываем STORE
        for (let prop in STORE) {
            if (prop !== 'connect'
                && prop !== 'email'
                && prop !== 'phone') {

                delete STORE[prop];
            }
        }

        // Допушиваем в STORE первый вопрос
        STORE.stepsMap = ['#questionAge'];

        // Сбрасываем контроллеры
        $('input.controller').prop('checked', false);

        // Скрываем кнопку Далле и Показать результаты
        $('.btn-next-step__wrap').removeClass('show');

        // Показываем первый экран, если
        // был не виден (полсе прохождения
        // всего квиза)
        let firstScreen = $('#firstScreen'),
            isFirstScreenInvisible = firstScreen
                .hasClass('first-screen_invisible');

        if (isFirstScreenInvisible) {
            firstScreen.removeClass('first-screen_invisible');
        }

        // Если блок-заголовк вопросов скрыт,
        // показываем его
        let questionsCaption = $('#questionsCaption'),
            isQuestionsCaptionHidden = questionsCaption
                .hasClass('questions-caption__wrap_invisible');

        if (isQuestionsCaptionHidden) {
            questionsCaption
                .removeClass('questions-caption__wrap_invisible');
        }
    }

    $('._fullReset').click(fullReset);

    // Блокируем отправку всех форм.
    // Данные всегда отправляются асинхронно.
    $('form').submit(function (e) {
        e.preventDefault();

        const form = e.target,
            submit = $(this).find('[type="submit"]'),
            formType = $(this).find('[name="form"]').val();

        if (!submit.attr('disabled'))  {

            const request = $.ajax({
                method: 'post',
                url: 'https://quiz24.ru/portfolio/icon-scin/forms-handler.php',
                data: $(form).serialize(),
                dataType: 'json'
            });

            request.done(response => {
                if (IS_DEBUGGING) console.log(response);

                if (response.error) {
                    if (formType === 'callback') {
                        const dialogs = $(form)
                            .closest('.modal')
                            .find('.modal__dialog');

                        $(dialogs[0]).addClass('modal__dialog_hide');

                        setTimeout(() => {
                            $(dialogs[0]).addClass('hidden');
                            $(dialogs[1]).removeClass('hidden');
                        }, 300);

                        setTimeout(() => {
                            $(dialogs[1]).removeClass('modal__dialog_hide');
                        }, 400);
                    } else if (formType === 'subscribe') {
                        showModal($(form).find('[type="submit"]')[0]);
                    }
                } else {
                    console.log('Ошибка отправки сообщения в обработчике формы!')
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        }
    });
});