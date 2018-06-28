var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mork = require('./mork/');
var infodata = require('./mork/logindata/ls');
// mork('/api/home')
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
})
gulp.task('wat', function() {
    gulp.watch('src/scss/*.scss', ['sass'])
})
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 6060,
            host: 'localhost',
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                }

                var pathname = url.parse(req.url).pathname;

                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    // console.log(mork(pathname))数据

                    if (pathname == '/api/login' || pathname == '/api/res') {
                        //必须判断登录接口返回成功 注册成功向数组添加数据
                        //获取post请求传来的数据
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data)

                            //跟模拟数据库的数据判断 用some的方法
                            //如果是登录接口
                            if (pathname == '/api/login') {
                                var rest = infodata.info.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                })
                                if (rest) {
                                    res.end('{"result":"1","msg":"登陆成功"}')
                                } else {
                                    res.end('{"result":"0","msg":"用户名和密码不匹配"}')
                                }
                            } else {
                                console.log(data)
                                    //注册接口 {"user":1115,"pwd":"1222"}
                                infodata.info.push(data);
                                var objs = {
                                    info: infodata.info
                                }
                                require('fs').writeFileSync('./mork/logindata/ls.json', JSON.stringify(objs));
                                res.end('{"result":"1","msg":"注册成功"}')
                            }
                        })

                        return false;

                    }
                    res.end(JSON.stringify(mork(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }

            }
        }))
})
gulp.task('dev', ['wat', 'server'])

//压缩css
var cleancss = require('gulp-clean-css');
var autofixer = require('gulp-autoprefixer');
gulp.task('mincss', function() {
        gulp.src('src/css/*.css')
            .pipe(autofixer({
                browsers: ['last 2 versions']
            }))
            .pipe(cleancss())
            .pipe(gulp.dest('bulid/css'))
    })
    //压缩js es6转es5
var uglify = require('gulp-uglify');
var es5 = require('gulp-babel');
gulp.task('minjs', function() {
    gulp.src('src/**/*.js')
        .pipe(es5({
            presets: 'es2015'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('bulid'))
});
//压缩html
var htmlmin = require('gulp-htmlmin');
gulp.task('htmlmin', function() {
    gulp.src('src/**/*.html')
        .pipe(htmlmin({
            removeComments: false, //保留所有注释
            collapseWhitespace: true

        }))
        .pipe(gulp.dest('bulid'))
})
gulp.task('bulidserver', function() {
    gulp.src('bulid')
        .pipe(server({
            port: 6060,
            host: 'localhost',
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false;
                }

                var pathname = url.parse(req.url).pathname;

                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    // console.log(mork(pathname))数据

                    if (pathname == '/api/login' || pathname == '/api/res') {
                        //必须判断登录接口返回成功 注册成功向数组添加数据
                        //获取post请求传来的数据
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data)

                            //跟模拟数据库的数据判断 用some的方法
                            //如果是登录接口
                            if (pathname == '/api/login') {
                                var rest = infodata.info.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                })
                                if (rest) {
                                    res.end('{"result":"1","msg":"登陆成功"}')
                                } else {
                                    res.end('{"result":"0","msg":"用户名和密码不匹配"}')
                                }
                            } else {
                                console.log(data)
                                    //注册接口 {"user":1115,"pwd":"1222"}
                                infodata.info.push(data);
                                var objs = {
                                    info: infodata.info
                                }
                                require('fs').writeFileSync('./mork/logindata/ls.json', JSON.stringify(objs));
                                res.end('{"result":"1","msg":"注册成功"}')
                            }
                        })

                        return false;

                    }
                    res.end(JSON.stringify(mork(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'bulid', pathname)));
                }

            }
        }))
})
gulp.task('bulid', ['mincss', 'minjs', 'htmlmin', 'bulidserver'])