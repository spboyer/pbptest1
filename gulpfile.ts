"use strict";

const gulp = require("gulp");
const del = require("del");
const tsc = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject("tsconfig.json");
const tslint = require('gulp-tslint');

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
    return del(["build"], cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", ["tslint"], () => {
    let tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ["server"], () => {
    return gulp.src(["src/**/*", "!**/*.ts", "!src/server", "!src/server/**"])
        .pipe(gulp.dest("build"));
});

gulp.task("server", () => {
    return gulp.src(["index.js", "package.json"], { cwd: "src/server/**"})
        .pipe(gulp.dest("build"));
});


/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", () => {
    return gulp.src([
            'es6-shim/es6-shim.min.js',
            'systemjs/dist/system-polyfills.js',
            'angular2/bundles/angular2-polyfills.js',
            'angular2/es6/dev/src/testing/shims_for_IE.js',
            'systemjs/dist/system.src.js',
            'rxjs/bundles/Rx.js',
            'angular2/bundles/angular2.dev.js',
            'angular2/bundles/router.dev.js'
        ], {cwd: "node_modules/**"}) /* Glob required here. */
        .pipe(gulp.dest("build/lib"));
});

/**
 * Build the project.
 */
gulp.task("build", ['resources', 'libs'], () => {
    console.log("Building the project ...");
});