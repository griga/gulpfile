var gulp = require('gulp');
var ts = require('gulp-typescript');
var connect = require('gulp-connect');

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

gulp.task('ts', function () {
    return gulp.src(source.ts.src)
        .pipe(ts({
            out: 'bundle.js',
            target: 'ES5'
        }))
        .pipe(gulp.dest(destinations.ts))
});

gulp.task('watch', function(){
    gulp.watch(source.ts.src, ['ts']);
});

gulp.task('connect', function() {
    connect.server({
        port: 42425
    });
});



gulp.task('exec', function() {

    gulp.src('./build/*.*')
        .pipe(exec('node ./build/bundle.js'))
        .pipe(exec.reporter());
});

gulp.task('default', ['ts', 'watch', 'connect']);