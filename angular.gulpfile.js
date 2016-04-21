// npm install event-stream gulp gulp-concat gulp-angular-templatecache gulp-ng-annotate gulp-uglify gulp-babel lodash gulp-sass gulp-minify-css --save-dev

var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var babel = require('gulp-babel')
var _ = require('lodash');
var sass = require('gulp-sass');


var source = {
    js: {
        main: 'src/app/main.js',
        src: [
            // application config
            // 'app.config.js',

            // application bootstrap file
            'src/app/main.js',

            // main module
            'src/app/app.js',

            // module files
            'src/app/**/module.js',

            // other js files [controllers, services, etc.]
            'src/app/**/!(module)*.js'
        ],
        html: 'src/app/**/*.html'
    },
    sass: {
        main: 'src/sass/style.scss',
        src: [
            'src/sass/**/*.scss',
        ]
    },
    vendor: {
      paths: [
        "bower_components/lodash/dist/lodash.min.js",
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/moment/min/moment.min.js",
        "bower_components/angular/angular.min.js",
        "bower_components/angular-animate/angular-animate.min.js",
        "bower_components/angular-aria/angular-aria.min.js",
        "bower_components/angular-messages/angular-messages.min.js",
        "bower_components/angular-material/angular-material.min.js",
        "bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "bower_components/angular-dnd-module/dist/angular-dnd.min.js",
        "bower_components/angular-easyfb/build/angular-easyfb.min.js",
      ]
    }
};

var destinations = {
    js: 'public/build',
    sass: 'public/build',
};


gulp.task('build', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
        .pipe(babel({
            presets: ['es2015']
        }))
         .pipe(ngAnnotate())
         .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('js', function(){
    return es.merge(
      gulp.src(source.js.src)

       , getTemplateStream())
       .pipe(babel({
          presets: ['es2015']
        }))
        .on('error', swallowError)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('watch', function(){
    gulp.watch(source.sass.src, ['sass']);
    gulp.watch(source.js.src, ['js']);
    gulp.watch(source.js.html, ['js']);
});

gulp.task('vendor', function(){
    source.vendor.paths.forEach(function(p){
      if (!fs.existsSync(__dirname + '/' + p )){
        throw new Error(p + ' not exist')
      }
    });
   return gulp.src(source.vendor.paths)
        .pipe(concat('vendor.bundle.js'))
        //.on('error', swallowError)
        .pipe(gulp.dest(destinations.js))
});

gulp.task('sass', function () {
    return gulp.src(source.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(destinations.sass));
});

gulp.task('prod', ['vendor', 'sass', 'build']);
gulp.task('dev', ['vendor', 'sass', 'js', 'watch']);
gulp.task('default', ['dev']);

var swallowError = function(error){
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function () {
    return gulp.src(source.js.html)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
};
