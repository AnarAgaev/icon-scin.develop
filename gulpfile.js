// Package connection
const {src, dest, watch, series, parallel}  = require('gulp');
const del                                   = require('del');
const plumber                               = require('gulp-plumber');
const notify                                = require('gulp-notify');
const sass                                  = require('gulp-sass');
const autoprefixer                          = require('gulp-autoprefixer');
const cssbeautify                           = require('gulp-cssbeautify');
const pug                                   = require('gulp-pug');
const rename                                = require('gulp-rename');
const imagemin                              = require('gulp-imagemin');
const browserSync                           = require('browser-sync').create();
const concat                                = require('gulp-concat');
//const sourcemaps                            = require('gulp-sourcemaps');
const log                                   = require('fancy-log');

// Tasks
function clean() {
 return del('./build');
}

function buildStyles() {
    //return src('src/**/main.scss', { sourcemaps: false })
    return src('src/**/main.scss')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Sass Styles Error',
                    message: err.message
                }
            })
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(cssbeautify({
            indent: '   ',
            openbrace: 'end-of-line',
            autosemicolon: true
        }))
        .pipe(rename({
            dirname: '',
        }))
        // .pipe(dest('build/css', { sourcemaps: '../maps' }))
        .pipe(dest('build/css'))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
}

function buildHtml() {
    return src(['src/pages/**/index.pug'])
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Pug Error',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname;
            fileObj.dirname = '';
        }))
        .pipe(dest('build'))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
}

function buildJs() {
    return src([
        'src/templates/default/js/cocoen.js',
        'src/templates/default/js/jquery-3.6.0.min.js',
        'src/templates/default/js/imask.min.js',
        'src/templates/default/js/swiper-bundle.min.js',
        'src/templates/default/js/main.js',
        'src/templates/default/js/sliders.js',
        'src/templates/default/header/header.js',
        'src/templates/default/footer/footer.js',
        'src/templates/default/modals/modals.js',
        'src/pages/**/*.js'
    ])
        //.pipe(sourcemaps.init())
        .pipe(rename({
            dirname: '',
        }))
        .pipe(concat('script.js'))
        //.pipe(sourcemaps.write())
        .pipe(dest('build/js'))
        .pipe(browserSync.stream())
}

function buildFonts() {
    return src('src/fonts/**/*')
        .pipe(dest('build/fonts'))
        .pipe(browserSync.stream())
}

function buildImages() {
    return src('src/img/**/*')
        .pipe(dest('build/img'))
        .pipe(browserSync.stream())
}

function buildVideo() {
    return src('src/video/**/*')
        .pipe(dest('build/video'))
        .pipe(browserSync.stream())
}

function server() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    })
}

// Watches
watch('src/**/*.scss', buildStyles);
watch('src/**/*.pug', buildHtml);
watch('src/**/*.js', buildJs);
watch('src/fonts/**/*', buildFonts);
watch('src/img/**/*', buildImages);
watch('src/video/**/*', buildVideo);

// Build project
exports.default = series(
    clean,
    parallel(
        buildStyles,
        buildHtml,
        buildJs,
        buildFonts,
        buildImages,
        buildVideo
    ),
    server
);