$(document).ready(() => {
    // Слайдер с результатами
    window.resultsSliders = new Swiper('.swiper', {
        slidesPerView: 1,
        speed: 300,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: true,
        spaceBetween: 15,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        }
    });
});

$(document).ready(() => {

    /* В случае медленной загрузки, некоторые картинки в салйдерах
     * долго не прогружаются. Чтобы невелировать данную ошибку,
     * обновляем слайдер как только доскролили до него.
     * Обновляются все сладеры. 
     * 
     * Возможная оптимизация: найти текущий лайдер
     * в массиве resultsSliders и исключить его.
     *
     */
    $(window).scroll(() => {

        let sliders = $('.visible .swiper').not('.updated');
        let scroll = $(window).scrollTop() + $(window).height();

        if (sliders.length > 0) {
            sliders.each((idx, el) => {
                let elOffsetTop = $(el).offset().top;

                if (elOffsetTop < scroll) {
                    $(el).addClass('updated');

                    resultsSliders.forEach(slider => {
                        slider.update();
                        slider.updateAutoHeight(10);
                    });
                }
            });
        }
    });
     
});