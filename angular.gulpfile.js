// sails dependencies
// npm install ejs rc sails sails-disk sails-mongo
// gulp dependencies 
// npm install event-stream gulp gulp-concat gulp-angular-templatecache gulp-ng-annotate gulp-uglify gulp-babel babel-preset-es2015 lodash gulp-sass gulp-livereload --save-dev
// bower install lodash moment codemirror angular angular-resource angular-animate angular-aria angular-messages angular-material  angular-ui-router angular-ui-codemirror 

var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var babel = require('gulp-babel')
var iife = require('gulp-iife')
var _ = require('lodash');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

var sources = {
    app: {
        main: 'src/app/main.js',
        src: [
            'src/app/main.js',
            'src/app/app.js',
            'src/app/**/*module.js',
            'src/app/**/!(module)*.js'
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
    css: [
        "bower_components/codemirror/lib/codemirror.css",
        "bower_components/codemirror/theme/material.css",
        "bower_components/codemirror/addon/display/fullscreen.css",
        "bower_components/highlightjs/styles/darkula.css",
    ],
    vendor: {
        paths: {
            prod: [
                "bower_components/lodash/dist/lodash.min.js",
                "bower_components/moment/min/moment.min.js",
                "bower_components/codemirror/lib/codemirror.js",
                "bower_components/codemirror/mode/markdown/markdown.js",
                "bower_components/codemirror/addon/display/fullscreen.js",
                "bower_components/showdown/dist/showdown.min.js",
                "bower_components/highlightjs/highlight.pack.min.js",
                "bower_components/angular/angular.min.js",
                "bower_components/angular-resource/angular-resource.min.js",
                "bower_components/angular-animate/angular-animate.min.js",
                "bower_components/angular-aria/angular-aria.min.js",
                "bower_components/angular-messages/angular-messages.min.js",
                "bower_components/angular-sanitize/angular-sanitize.min.js",
                "bower_components/angular-material/angular-material.min.js",
                "bower_components/angular-ui-router/release/angular-ui-router.min.js",
                "bower_components/angular-ui-codemirror/ui-codemirror.min.js",
                "bower_components/angular-easyfb/build/angular-easyfb.min.js",
                "bower_components/ng-showdown/dist/ng-showdown.min.js"
            ],
            dev: [
                "bower_components/lodash/dist/lodash.js",
                "bower_components/moment/moment.js",
                "bower_components/codemirror/lib/codemirror.js",
                "bower_components/codemirror/mode/markdown/markdown.js",
                "bower_components/codemirror/addon/display/fullscreen.js",
                "bower_components/showdown/dist/showdown.js",
                "bower_components/highlightjs/highlight.pack.js",
                "bower_components/angular/angular.js",
                "bower_components/angular-resource/angular-resource.js",
                "bower_components/angular-animate/angular-animate.js",
                "bower_components/angular-aria/angular-aria.js",
                "bower_components/angular-messages/angular-messages.js",
                "bower_components/angular-sanitize/angular-sanitize.js",
                "bower_components/angular-material/angular-material.js",
                "bower_components/angular-ui-router/release/angular-ui-router.js",
                "bower_components/angular-ui-codemirror/ui-codemirror.min.js",
                "bower_components/angular-easyfb/build/angular-easyfb.js",
                "bower_components/ng-showdown/dist/ng-showdown.js"
            ]
        }
    },
    assets: {
        src: [
            'src/static/**/*.*'
        ]
    }
};

var destinations = {
    dev: {
        root: "./.tmp/public",
        js: './.tmp/public/js',
        css: './.tmp/public/css',
    },
    prod: {
        root: "./web",
        js: './web/js',
        css: './web/css',
    },
};


function compile(appName, target) {
    var bundle = es.merge(
        gulp.src(sources[appName].src)
        , getTemplateStream(appName))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(iife())
        .on('error', swallowError)
        .pipe(concat(sources[appName].out))

    if (target == 'prod') {
        bundle
            .pipe(ngAnnotate())
            .pipe(uglify())
    }

    return bundle.pipe(gulp.dest(destinations[target].js))
        .pipe(livereload());
}

gulp.task('compile-js-dev', compile.bind(this, 'app', 'dev'))
gulp.task('compile-js-prod', compile.bind(this, 'app', 'prod'))

gulp.task('watch', function () {
    livereload.listen()
    gulp.watch(sources.sass.src, ['sass-dev']);
    gulp.watch(sources.app.src, ['compile-js-dev']);
    gulp.watch(sources.app.html, ['compile-js-dev']);
    gulp.watch(sources.assets.src, ['assets-dev']);
});


function vendorJs(target) {
    var paths = sources.vendor.paths[target]
    paths.forEach(function (p) {
        if (!fs.existsSync(__dirname + '/' + p)) {
            throw new Error(p + ' not exist')
        }
    });
    return gulp.src(paths)
        .pipe(concat('vendor.bundle.js'))
        //.on('error', swallowError)
        .pipe(gulp.dest(destinations[target].js))
}
gulp.task('vendor-prod', vendorJs.bind(this, 'prod'));
gulp.task('vendor-dev', vendorJs.bind(this, 'dev'));


function vendorCss(target) {
    return gulp.src(sources.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(destinations[target].css))
}
gulp.task('vendor-css-dev', vendorCss.bind(this, 'dev'))
gulp.task('vendor-css-prod', vendorCss.bind(this, 'prod'))


function compileSass(target) {
    return gulp.src(sources.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(destinations[target].css))
        .pipe(livereload());
}

gulp.task('sass-dev', compileSass.bind(this, 'dev'));
gulp.task('sass-prod', compileSass.bind(this, 'prod'));

function copyAssets(target) {
    return gulp.src(sources.assets.src)
        .pipe(gulp.dest(destinations[target].root))
}

gulp.task('assets-dev', copyAssets.bind(this, 'dev'))
gulp.task('assets-prod', copyAssets.bind(this, 'prod'))


gulp.task('prod', ['vendor-prod', 'vendor-css-prod', 'sass-prod', 'compile-js-prod', 'assets-prod']);
gulp.task('dev', ['nodemon', 'vendor-dev', 'vendor-css-dev', 'sass-dev', 'compile-js-dev', 'compile-dev', 'watch', 'assets-dev']);
gulp.task('default', ['dev']);

var swallowError = function (error) {
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function (key) {
    return gulp.src(sources[key].html)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
};
