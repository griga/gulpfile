const gulp = require('gulp');
const typescript = require('gulp-typescript');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify')
const util = require('gulp-util')
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./tsconfig.json');

var source = {
    ts: {
        main: 'src/app/main.ts',
        src: [
            'src/app/main.ts',
            'src/app/**/*.ts'
        ]
    }
};

var sources = {
    ts: {
        main: 'src/app/main.ts',
        src: [
            'src/app/main.ts',
            'src/app/**/*.ts'
        ],

        html: 'src/app/**/*.html',
        out: 'bundle.js',
    },

    sass: {
        main: 'src/sass/style.scss',
        src: [
            'src/sass/**/*.scss',
        ]
    },
    css: [],
    vendor: {
        paths: {
            prod: [
                'node_modules/angular2/bundles/angular2-polyfills.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx.js',
                'node_modules/angular2/bundles/angular2.dev.js',
                'node_modules/angular2/bundles/router.dev.js'

            ],
            dev: [
                'node_modules/angular2/bundles/angular2-polyfills.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx.js',
                'node_modules/angular2/bundles/angular2.dev.js',
                'node_modules/angular2/bundles/router.dev.js'
            ]
        }
    },
    assets: {
        src: [
            'src/static/**/*.*'
        ]
    },
    html: {
        main: 'src/index.html'
    }


};

var destinations = {
    dev: {
        root: "./.tmp",
        js: './.tmp/js',
        css: './.tmp/css',
    },
    prod: {
        root: "./dist",
        js: './dist/js',
        css: './dist/css',
    },
};


gulp.task('ts', function () {
    return gulp
        .src(sources.ts.src)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});


gulp.task('watch', function () {
    gulp.watch(source.ts.src, ['ts']);
});

gulp.task('connect', function () {
    connect.server({
        port: 10090,
        livereload: true
    });
});


gulp.task('default', ['ts', 'watch', 'connect']);
