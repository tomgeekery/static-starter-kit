"use strict";

import gulp from "gulp";
import cssnano from "cssnano";
import babel from "gulp-babel";
import uncss from "postcss-uncss";
import postcss from "gulp-postcss";
import imagemin from "gulp-imagemin";
import BrowserSync from "browser-sync";
import cssImport from "postcss-import";
import imageminSvgo from "imagemin-svgo";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import postcssPresetEnv from "postcss-preset-env";

const browserSync = BrowserSync.create();

// Images task.
gulp.task("images", () => {
  // Handle JPEGs
  gulp.src("./src/img/**/*.jpg")
    .pipe(imagemin([imageminMozjpeg({ quality: 80 })], {
      progressive: true,
    }))
    .pipe(gulp.dest("./web/img"));

  // Handle PNGs.
  gulp.src("./src/img/**/*.png")
    .pipe(imagemin([imageminPngquant({ strip: true })]))
    .pipe(gulp.dest("./web/img"));

  // Handle SVGs
  gulp.src("./src/img/**/*.svg")
    .pipe(imagemin([imageminSvgo()]))
    .pipe(gulp.dest("./web/img"));
});

// CSS task.
gulp.task("css", () => {
  gulp.src("./src/css/main.css")
    .pipe(postcss([
      cssImport({ from: "./src/css/main.css" }),
      postcssPresetEnv(),
      uncss({
        html: ["./web/**/*.html"]
      }),
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
  gulp.src("./src/html/*.html")
    .pipe(gulp.dest("./web"));

  browserSync.reload();
  done();
});

// Default task.
gulp.task("default", ["html", "css", "js", "images"], () => {  
  browserSync.init({
    browser: [],
    server: {
      baseDir: "./web"
    }
  });

  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/html/**/*.html", ["html", "css"]);

  gulp.watch("src/img/**/*", ["images"]);
});
