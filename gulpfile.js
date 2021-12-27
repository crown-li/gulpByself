const gulp = require('gulp');
const fs = require('fs');
const {resolve} = require('path')
const less = require('gulp-less');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer')
const debug = require('gulp-debug')
const spriter = require('gulp-css-spriter');
const px2rem = require('gulp-px2rem-plugin');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');



// const files = fs.readdirSync(pathName)
const files = fs.readdirSync('./../')
files.splice(files.indexOf('gulp'),1)
let ROOT_DIR = `../${files[0]}` 
console.log('ROOT_DIR:',ROOT_DIR)

/**
 * @description: 兼容未修改文件的移动
 * @param {function | string} compileLess
 * @return {date | timestamp | function}
 */
const since = task => file => gulp.lastRun(task) > file.stat.ctime ? gulp.lastRun(task) : 0;

const compileLess = () => {
    // return gulp.src('./less/*.less', {since:since(compileLess)})
    return gulp.src(`${ROOT_DIR}/less/*.less`)
        .pipe(less())
        .pipe(debug({
            title:'Processing：'
        }))
        // .pipe(concat('mian.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid:true,
            cascade:false
        }))
        // .pipe(px2rem({
        //     'width_design':1920,
        //     'pieces':10,
        // }))
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': `${ROOT_DIR}/img/spritesheet.png`,
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': `./../img/spritesheet.png`
        }))
        .pipe(cssnano({
            autoprefixer: false,
        }))
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest(`${ROOT_DIR}/css`))
}

const compileJs = () => {
    return gulp.src(`${ROOT_DIR}/js/*.js`)
        .pipe(debug({
            title:'Processing：'
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${ROOT_DIR}/dist`))
}

const watch = () => {
    gulp.watch([`${ROOT_DIR}/less/*.less`,`${ROOT_DIR}/js/*.js`], { ignoreInitial:false },gulp.series(compileLess,compileJs))
}

const build = (done) => {
    gulp.series(compileLess,compileJs);
    done();
}


module.exports = {
    default:watch,
    build
}
