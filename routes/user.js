var express = require('express');
var router = express.Router();
var pgclient = require('dao/pgHelper');

//引用上传图片需要的模型
let multer = require("multer");
let path = require("path");
let fs = require("fs");

/* 获取用户个人中心界面 */
router.get('/', function(req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        pgclient.select('admin', {'username': res.locals.islogin.username},'',function (result) {
            if (result[0] === undefined){
                res.redirect('/login');
            }
            else{
                res.render("user",{title: "个人中心", data: result, users: res.locals.islogin});
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/user_update/:name', function (req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        var username = req.params.name;
        pgclient.select('admin', {'username': username}, '', function(result){
            if (result[0] === undefined) {
                res.redirect('/user');
            }
            else
            {
                res.render("user_update", {title:'个人信息修改', data: result, users: res.locals.islogin});
            }
        });
    }
    //如果不存在用户登录，返回用户页面，并进一步返回到登录的界面
    else {
        res.redirect('/user');
    }
});

//修改用户信息
router.post('/update', function (req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;

        //获取前端要修改的信息
        var id = req.body.id;
        var username = req.body.username;
        var password = req.body.confirmPassword;
        var email = req.body.email;
        var telephone = req.body.telephone;
        pgclient.update('admin', {'id': id}, {'username': username, 'email': email, 'password': password, 'telephone': telephone}, function (err) {
            if (err != ''){
                res.send("修改失败：" + err +"<br/><a href='/user'>请返回！</a>");
            }
            else {
                //修改cookies
                pgclient.select('admin', {'username': username}, '', function (result) {
                    if (result[0] === undefined) {

                    } else {
                        // 修改cookies
                        req.session.islogin = result[0];
                        res.locals.islogin = req.session.islogin;
                        res.cookie('islogin', res.locals.islogin, {maxAge: 300000});
                        //返回用户界面
                        res.redirect('/user');
                    }
                });

            }
        });
    }
});

/* 上传图片 */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var filePath = path.resolve(__dirname, '../public/images/userHeadImage');
        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

var upload = multer({storage: storage});
router.post("/upload", upload.single('file'), function (req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin) {
        var user = res.locals.islogin;
        var imageurl = '../public/images/userHeadImage/' + path.basename(req.file.path);
        pgclient.update('admin', {'id': user.id}, {'imageurl': imageurl}, function (err) {
            if (err != ''){
                res.send("修改失败：" + err +"<br/><a href='/user'>请返回！</a>");
            }
            else{
                pgclient.select('admin', {'id': user.id}, '', function (result) {
                    if (result[0] === undefined) {
                    } else {
                        // 修改cookies
                        req.session.islogin = result[0];
                        res.locals.islogin = req.session.islogin;
                        res.cookie('islogin', res.locals.islogin, {maxAge: 300000});
                        res.json({code: 0, filePath: imageurl});
                    }
                });
            }
        });

    }
    else {
        res.send("<script>alert('用户登录超时，请登录后再修改图片！')</script>");
        res.redirect('/login');
    }
});

module.exports = router;