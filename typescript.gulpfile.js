var gulp = require('gulp');
var ts = require('gulp-typescript');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify')
var util = require('gulp-util')

var source = {
    ts: {
        main: 'src/app/main.ts',
        src: [
            'src/app/main.ts',
            'src/app/**/*.ts'
        ]
    }
};

var destinations = {
    ts: 'build'
};

var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function () {
    var tsResult = tsProject.src(source.ts.src)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest(destinations.ts)).pipe(connect.reload())
});

gulp.task('prod', function () {
    var tsResult = tsProject.src(source.ts.src)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(uglify()).pipe(gulp.dest(destinations.ts))
});

gulp.task('watch', function(){
    gulp.watch(source.ts.src, ['ts']);
});

gulp.task('connect', function() {
    connect.server({
        port: 42428,
        livereload: true
    });
});



gulp.task('default', ['ts', 'watch', 'connect']);
