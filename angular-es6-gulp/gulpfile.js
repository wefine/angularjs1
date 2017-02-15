const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');

// Load all gulp plugins into the plugins object.
const plugins = require('gulp-load-plugins')();

const src = {
    html: 'src/**/*.html',
    libs: 'src/libs/**',
    scripts: {
        all: 'src/scripts/**/*.js',
        app: 'src/scripts/app.js'
    }
};

const buildDir = 'build/';
const out = {
    libs: buildDir + 'libs/',
    scripts: {
        file: 'app.min.js',
        folder: buildDir + 'scripts/'
    }
};

gulp.task('html', function () {
    return gulp.src(src.html)
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.connect.reload());
});

/* The jshint task runs jshint with ES6 support. */
gulp.task('jshint', function () {
    return gulp.src(src.scripts.all)
        .pipe(plugins.jshint({
            esnext: true // Enable ES6 support
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('libs', function () {
    /* In a real project you of course would use npm or bower to manage libraries. */
    return gulp.src("bower_components/angular/angular.min.js")
        .pipe(gulp.dest(out.libs));

});

/* Compile all script files into one output minified JS file. */
gulp.task('scripts', ['jshint'], function () {

    let sources =
        browserify({
            entries: src.scripts.app,
            debug: true // Build source maps
        })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
            presets: ["es2015"]
        }));


    return sources.bundle()
        .pipe(vinylSourceStream(out.scripts.file))
        .pipe(vinylBuffer())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true // Load the sourcemaps browserify already generated
        }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('./', {
            includeContent: true
        }))
        .pipe(gulp.dest(out.scripts.folder))
        .pipe(plugins.connect.reload());

});

gulp.task('serve', ['build', 'watch'], function () {
    plugins.connect.server({
        root: buildDir,
        port: 4242,
        livereload: true,
        fallback: buildDir + 'index.html'
    });
});

gulp.task('watch', function () {
    gulp.watch(src.html, ['html']);
    gulp.watch(src.scripts.all, ['scripts']);
});

gulp.task('build', ['scripts', 'html', 'libs']);
gulp.task('default', ['serve']);
