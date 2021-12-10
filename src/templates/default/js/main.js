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
            STORE.phone = '';
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
        let top = $('#activeQuestionPlace').offset().top;

        $('body,html').animate(
            { scrollTop: top + 2 },
            1000
        );
    });

    // Блокируем отправку всех форм.
    // Данные всегда отправляются асинхронно.
    $('form').submit(e => {
        e.preventDefault();
    });
});