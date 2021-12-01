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

window.validatePhone = phone => {
    let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
    return regular.test(phone);
};

// В суперглобальной переменной храним все дынные, введенные пользователем
window.STORE = {
    connect: "WhatsApp",
};

// С помощью проксирования слушаем изменение стэйта
STORE = new Proxy(STORE, {
    set: function (target, prop, val) {

        target[prop] = val;

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
    }
});

const updatePhones = (phone) => {
    for (let i = 0; i < PHONE_MASKS.length; i++) {
        PHONE_MASKS[i].unmaskedValue = phone;
    }
}

// Маски для всех телефонов сохраняем в отдельный суперглобальный массив
const PHONE_MASKS = [];

// Маска для телефона. Испльзуется во всех телефонах
const phoneMaskOptions = {
    mask: '+{7} ({9}00) 000-00-00',
    lazy: true,
    placeholderChar: '_'
};

$(document).ready(() => {

    // Блокируем отправку всех форм.
    // Данные всегда отправляются асинхронно.
    $('form').submit(e => {
        e.preventDefault();
    });
});



