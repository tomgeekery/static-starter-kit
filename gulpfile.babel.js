"use strict";

import gulp from "gulp";
import cssnano from "cssnano";
import babel from "gulp-babel";
import postcss from "gulp-postcss";
import BrowserSync from "browser-sync";
import cssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";

const browserSync = BrowserSync.create();

// CSS task.
gulp.task("css", () => {
  gulp.src("./src/css/*.css")
    .pipe(postcss([
      cssImport({ from: "./src/css/main.css" }),
      postcssPresetEnv(),
      cssnano(),
    ]))
    .pipe(gulp.dest("./web"))
    .pipe(browserSync.stream());
});

// JavaScript task.
gulp.task("js", (done) => {
  gulp.src("./src/js/*.js")
    .pipe(babel({ presets: ["env"] }))
    .pipe(gulp.dest("./web"));

  browserSync.reload();
  done();
});

// HTML task.
gulp.task("html", (done) => {
  browserSync.reload();
  done();
});

// Default task.
gulp.task("default", ["css", "js", "html"], () => {  
  browserSync.init({
    server: {
      baseDir: "./web"
    }
  });

  gulp.watch("./src/css/*.css", ["css"]);
  gulp.watch("./src/js/*.js", ["js"]);
  gulp.watch("./web/*.html", ["html"]);
});
