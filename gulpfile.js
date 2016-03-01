var gulp = require('gulp'),
		webserver = require('gulp-webserver'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		jade = require('gulp-jade'),
		plumber = require('gulp-plumber'),
		notify = require("gulp-notify"),
		minifyCSS = require('gulp-minify-css'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		uglify = require('gulp-uglify'),
		imageop = require('gulp-image-optimization');

var config = {
	styles:{
		main: './src/stylus/main.styl',
		watch: './src/stylus/**/*.styl',
		output: './build/css'
	},
	scripts: {
    main: './src/js/main.js',
    watch: './src/js/**/*.js',
    output: './build/js'
  },
	html: {
		main: './src/template/index.jade',
		watch: './src/template/**/*.jade',
		output: './build'
	},
	images: {
		watch: ['./src/images/*.jpg', './src/images/*.png'],
		output: './build/images'
	}
};

gulp.task('server', function() {
	gulp.src('./build')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8080,
			livereload: true
		}));
});

gulp.task('jade', function() {
	gulp.src(config.html.main)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.html.output))
});

gulp.task('build:css', function() {
	gulp.src(config.styles.main)
		.pipe(plumber())
		.pipe(stylus({
			set: [
				"resolve url",
				"include css",
				"linenos",
				"compress"
			],
			use: nib(),
			'include css': true
		})).on("error", notify.onError({
			message: "<%= error.message %>",
			title: "Stylus Error"
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output));
});

gulp.task('build:js', function () {
	return browserify(config.scripts.main)
	.pipe(plumber())
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(gulp.dest(config.scripts.output))
});

gulp.task('images', function() {
	gulp.src(config.images.watch)
		.pipe(imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(config.images.output))
})

gulp.task('watch', function() {
	gulp.watch(config.images.watch, ['images']);
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.scripts.watch, ['build:js']);
	gulp.watch(config.html.watch, ['jade']);
});

gulp.task('build',['build:css' , 'build:js']);

gulp.task('default', ['server' , 'watch' , 'build' , 'images' , 'jade']);
