const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const inject = require('gulp-inject');

// Load all gulp plugins into the plugins object.
const plugins = require('gulp-load-plugins')();

const src = {
	html: 'app/**/*.html',
	libs: 'src/libs/**',
	scripts: {
		all: 'src/scripts/**/*.js',
		app: 'src/scripts/app.js'
	}
};

const build = 'build/';
const out = {
	libs: build + 'libs/',
	scripts: {
		file: 'app.min.js',
		folder: build + 'scripts/'
	}
};

gulp.task('styles', function() {
    return gulp.src('./src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build'));
});

gulp.task('html', function() {
	return gulp.src(src.html)
		.pipe(gulp.dest(build))
		.pipe(plugins.connect.reload());
});

/* Compile all script files into one output minified JS file. */
gulp.task('scripts', function() {

	let sources = browserify({
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

gulp.task('index', function() {

    let target = gulp.src('app/index.html');

    let js = gulp.src([
        'app/bower_components/angular/angular.js'
    ], {read: false, cwd: 'build/'});

    target
        .pipe(inject(js, { addRootSlash: false }))
        .pipe(gulp.dest('build'));
});

gulp.task('serve', ['build', 'watch'], function() {
	plugins.connect.server({
		root: build,
		port: 4242,
		livereload: true,
		fallback: build + 'index.html'
	});
});

gulp.task('watch', function() {
	gulp.watch(src.libs, ['libs']);
	gulp.watch(src.html, ['html']);
	gulp.watch(src.scripts.all, ['scripts']);
});

gulp.task('build', ['scripts', 'html', 'libs']);
gulp.task('default', ['serve']);
