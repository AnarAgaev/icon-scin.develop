$(document).ready(() => {
    $('._showAllText').click(e => {
        let _this = e.target,
            content = $(_this).prev();

        $(content).toggleClass('visible');

        toggleBtnText(_this);
    });

    const toggleBtnText = (el) => {
        if ($(el).text() === 'далее') {
            $(el).text('свернуть');
        } else {
            $(el).text('далее');
        }
    }
});