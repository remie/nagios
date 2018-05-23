'use strict';

// ------------------------------------------------------------------------------------------ Dependencies

const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('./tsconfig.json');

// ------------------------------------------------------------------------------------------ Tasks

gulp.task('default', ['build']);

gulp.task('build', ['assets', 'compile']);

gulp.task('compile', ['lint'], () => 
	tsProject.src()
			 .pipe(sourcemaps.init())
			 .pipe(tsProject())
			 .once("error", function () { this.once("finish", () => process.exit(1)); })
			 .pipe(sourcemaps.write())
			 .pipe(gulp.dest('./dist'))
);

gulp.task('lint', ['clean'], () => 
	gulp.src(['./src/**/*.ts'])
		.pipe(tslint({
			tslint: require('tslint'),
			formatter: "prose"
		}))
		.pipe(tslint.report({
			emitError: true,
			summarizeFailureOutput: true
		}))
		.once("error", function () { this.once("finish", () => process.exit(1)); })
);

gulp.task('assets', ['clean'], () => 
	gulp.src(['./src/**/*.json'])
		.pipe(gulp.dest('./dist'))
);

gulp.task('clean', () => del(['./dist/**/*']));

gulp.task('watch', ['build'], () => {
	gulp.watch(['./src/**/*.ts', './src/**/*.json'], ['build']);
});
