$(document).ready(() => {
    // Слайдер с результатами
    const resultsSlider = new Swiper('.results__res-slider__swiper', {
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
        },

        // breakpoints: {
        //     768: {
        //         centeredSlides: true,
        //         initialSlide: 1,
        //     }
        // }
    });
});