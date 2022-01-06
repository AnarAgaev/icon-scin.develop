$(document).ready(() => {
    // Слайдер с результатами
    window.resultsSlider = new Swiper('.swiper', {
        slidesPerView: 1,
        speed: 300,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: false,
        spaceBetween: 15,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        }
    });
});