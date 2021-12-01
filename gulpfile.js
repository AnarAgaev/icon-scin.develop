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
const sourcemaps                            = require('gulp-sourcemaps');

// Tasks
function clean() {
 return del('./build');
}

function buildStyles() {
    return src('src/**/main.scss', { sourcemaps: true })
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
        .pipe(dest('build/css', { sourcemaps: '../maps' }))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
}

function buildHtml() {
    return src(['src/pages/**/*.pug', '!src/pages/**/_*.pug'])
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
        .pipe(rename({
            dirname: '',
        }))
        .pipe(dest('build'))
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
}

function buildJs() {
    return src([
        'src/templates/default/js/jquery-3.6.0.min.js',
        'src/templates/default/js/main.js',
        'src/templates/default/js/toggle-steps.js',
        'src/templates/default/header/header.js',
        'src/templates/default/footer/footer.js',
        'src/pages/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(rename({
            dirname: '',
        }))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(dest('build/js'))
        .pipe(browserSync.stream())
}

function buildFonts() {
    return src('src/fonts/**/*')
        .pipe(dest('build/fonts'))
        .pipe(browserSync.stream())
}

function buildImages() {
    return src('src/images/**/*')
        .pipe(dest('build/images'))
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
watch('src/images/**/*', buildImages);

// Build project
exports.default = series(
    clean,
    parallel(
        buildStyles,
        buildHtml,
        buildJs,
        buildFonts,
        buildImages,
    ),
    server
);