var express = require('express');
var router = express.Router();
var pgclient = require('dao/pgHelper');
var cors = require('cors');
router.use(cors());

//连接数据库
pgclient.getConnection();

/* 主页 */
router.get('/', function (req, res) {
    //验证是否登录
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.render('index', {title: "HOME", name: res.locals.islogin});
    }
    res.redirect('/login');
});
router.route('/login')
    .get(function (req, res) {
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        res.render('login', {title: '用户登录'});
    })
    .post(function (req, res) {
        pgclient.select('admin', {'username': req.body.username}, '', function (result) {
            if (result[0] === undefined) {
                console.log(result);
                res.send("没有该用户");
            } else {
                if (result[0].password === req.body.password) {
                    req.session.islogin = req.body.username;
                    res.locals.islogin = req.session.islogin;
                    res.cookie('islogin', res.locals.islogin);
                    res.redirect('/home');
                } else {
                    res.redirect('/login');
                }
            }
        });
    });

router.get('/home', function (req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    res.render('index', {title: "HOME", name: res.locals.islogin});
});

router.get('/logout', function (req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/login');
});

router.route('/reg')
    .get(function (req, res) {
        res.render('register', {title: '注册'});
    })
    .post(function (req, res) {
        console.log(req.body.username);
        console.log(req.body.confirmPassword);
        console.log(req.body.email);
        console.log(req.body.telephone);
        pgclient.save('admin', {
            'username': req.body.username,
            'password': req.body.confirmPassword,
            'email': req.body.email,
            'telephone':req.body.telephone
        }, function (err) {
            pgclient.select('admin', {'username': req.body.username}, '', function (result) {
                if (result[0] === undefined) {
                    res.send('注册没有成功申请，重新注册');
                } else {
                    res.redirect('/login');
                }
            });
        });
    });
module.exports = router;
