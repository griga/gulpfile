const gulp = require('gulp');
const typescript = require('gulp-typescript');
const connect = require('gulp-connect');
// const uglify = require('gulp-uglify')
// const util = require('gulp-util')
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./tsconfig.json');

const inlineNg2Template = require('gulp-inline-ng2-template');



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
            prod: [
                'node_modules/angular2/bundles/angular2-polyfills.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx.js',
                'node_modules/angular2/bundles/angular2.dev.js',
                'node_modules/angular2/bundles/router.dev.js'

            ],
            dev: [
                'node_modules/angular2/bundles/angular2-polyfills.js',
                'node_modules/systemjs/dist/system-polyfills.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/rxjs/bundles/Rx.js',
                'node_modules/angular2/bundles/angular2.dev.js',
                'node_modules/angular2/bundles/router.dev.js',
                "node_modules/es6-shim/es6-shim.min.js",
                "node_modules/angular2/bundles/router.dev.js",
            ]
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
        js: './.tmp/app',
        css: './.tmp/css',
        lib: './.tmp/lib',
    },
    prod: {
        root: "./dist",
        js: './dist/js',
        lib: './dist/lib',
        css: './dist/css',
    },
};


gulp.task('ts', function () {
    return gulp
        .src(sources.ts.src)
        .pipe(inlineNg2Template({ base: './src',
            target: 'es5',              // Can swap to es5
            indent: 2,  }))
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destinations.dev.js));
});


gulp.task('watch', function () {
    gulp.watch(sources.ts.src, ['ts']);
    gulp.watch(sources.html.main, ['copy:main']);
});

gulp.task('connect', function () {
    connect.server({
        root: destinations.dev.root,
        port: 10090,
        livereload: true
    });
});

gulp.task('copy:libs', function () {
    gulp.src(sources.vendor.dev)
        .pipe(gulp.dest(destinations.dev.lib))
})
gulp.task('copy:main', function () {
    gulp.src(sources.html.main)
        .pipe(gulp.dest(destinations.dev.root))
})

gulp.task('clean:dev', function(cb){
    return del([
        destinations.dev.lib + '/**/*.*',
        destinations.dev.js + '/**/*.*',
    ], cb);
})


gulp.task('default', ['ts', 'clean:dev', 'copy:libs', 'copy:main', 'watch',  'connect']);
