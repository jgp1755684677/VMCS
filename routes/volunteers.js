var express = require('express');
var router = express.Router();
var pgclient = require('dao/pgHelper');

//查询列表页
router.get('/', function (req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        pgclient.select('volunteer', '', '', function (result) {
            if (result[0] === undefined) {
                res.send('没有志愿者信息!');
            } else {
                res.render('volunteers', {title: '志愿者信息管理', datas: result, users: res.locals.islogin});
            }
        });
    } else {
        res.redirect('/login');
    }
});

// 进入查询界面
router.get('/volunteers_search', function (req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.render('volunteers_search', {title: '志愿者查询', users: res.locals.islogin});
    } else {
        res.redirect('/login');
    }
});

// 获取查询条件，返回查询结果
router.post('/search', function (req, res, next) {
    // 判断用户是否登录
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    //判断用户是否登录，登录进行搜索操作
    if (res.locals.islogin) {
        //获取查询志愿者的名称
        var volunteerName = req.body.volunteerName;
        var volunteerTelephone = req.body.volunteerTelephone;
        var volunteerGroup = req.body.volunteerGroup;
        //进行查询并返回结果界面

        // 当三个输入框都输入时
        if (volunteerName && volunteerTelephone && volunteerGroup) {
            pgclient.select('volunteer', {
                'name': volunteerName,
                'telephone': volunteerTelephone,
                'team': volunteerGroup
            }, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        // 志愿者姓名未输入的时候
        else if (!volunteerName && volunteerTelephone && volunteerGroup) {
            pgclient.select('volunteer', {
                'telephone': volunteerTelephone,
                'team': volunteerGroup
            }, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        // 志愿者的电话未输入的时候
        else if (volunteerName && !volunteerTelephone && volunteerGroup) {
            pgclient.select('volunteer', {'name': volunteerName, 'team': volunteerGroup}, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        // 志愿者的组别未输入的时候
        else if (volunteerName && volunteerTelephone && !volunteerGroup) {
            pgclient.select('volunteer', {
                'name': volunteerName,
                'telephone': volunteerTelephone
            }, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        //只输入组别的时候
        else if (!volunteerName && !volunteerTelephone && volunteerGroup) {
            pgclient.select('volunteer', {'team': volunteerGroup}, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                    console.log(result);
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        //只输入电话的时候
        else if (!volunteerName && volunteerTelephone && !volunteerGroup) {
            pgclient.select('volunteer', {'telephone': volunteerTelephone}, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        // 只输入志愿者的姓名的时候
        else if (volunteerName && !volunteerTelephone && !volunteerGroup) {
            pgclient.select('volunteer', {'name': volunteerName}, '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.render('volunteers', {title: '志愿者查询结果', datas: result, users: res.locals.islogin});
                }
            });
        }

        // 没有输入信息的时候
        else if (!volunteerName && !volunteerTelephone && !volunteerGroup) {
            pgclient.select('volunteer', '', '', function (result) {
                if (result[0] === undefined || result == 'err') {
                    res.send('没有用户信息！');
                } else {
                    res.send("<h3>未输入查询条件，是否<a href='/volunteers'>显示所有的志愿者</a>，或者<a href='/volunteers/volunteers_search'>返回重新查询</a></h3>");
                }
            });
        }
    } else {
        //用户未登录，返回登录界面
        res.redirect('/login');
    }
});

// 获取志愿者添加界面
router.get('/volunteers_add', function (req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
        res.render('volunteers_add', {title: '志愿者添加', users: res.locals.islogin});
    } else {
        res.redirect('/login');
    }
});

// 或许添加的志愿者数据并添加到服务签上
// 获取志愿者添加界面
router.post('/add', function (req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin) {
        //获取新增志愿信息
        var volunteerName = req.body.volunteerName;
        var cardId = req.body.volunteerIDcard;
        var volunteerTelephone = req.body.volunteerTelephone;
        var volunteerSex = req.body.sex;
        var volunteerSchool = req.body.volunteerSchool;
        var volunteerJop = req.body.volunteerJop;
        var volunteerGroup = req.body.volunteerGroup;
        var volunteerGroupLeader = req.body.volunteerGroupLeader;
        pgclient.save('volunteer', {
            'name': volunteerName,
            'card_id': cardId,
            'sex': volunteerSex,
            'telephone': volunteerTelephone,
            'school': volunteerSchool,
            'team': volunteerGroup,
            'jop': volunteerJop,
            'remarks': volunteerGroupLeader
        }, function (err) {
            pgclient.select('volunteer', {'name': volunteerName}, '', function (result) {
                if (result[0] === undefined) {
                    res.send('添加未成功，请重新输入');
                } else {
                    res.render('volunteers', {title: '新增志愿者信息', datas: result, users: res.locals.islogin});
                }
            });
        });
    } else {
        res.redirect('/login');
    }
});

// 修改志愿者信息
// 获取修改的用户
router.get('/toUpdate/:id', function (req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin) {
        var id = req.params.id;
        pgclient.select('volunteer', {'id':id}, '', function(result){
            if (result[0] === undefined) {
                res.send('获取志愿者数据失败！');
            }
            else
            {
                res.render("volunteers_update", {title:'志愿者信息修改', datas: result, users: res.locals.islogin});
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

// 上传修改用户信息
router.post('/update', function(req, res){
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin){

    }
    var id = req.body.id;
    var volunteerName = req.body.volunteerName;
    var cardId = req.body.volunteerIDcard;
    var volunteerTelephone = req.body.volunteerTelephone;
    var volunteerSex = req.body.sex;
    var volunteerSchool = req.body.volunteerSchool;
    var volunteerJop = req.body.volunteerJop;
    var volunteerGroup = req.body.volunteerGroup;
    var volunteerGroupLeader = req.body.volunteerGroupLeader;
    pgclient.update('volunteer', {'id': id}, {'name': volunteerName,
        'card_id': cardId,
        'sex': volunteerSex,
        'telephone': volunteerTelephone,
        'school': volunteerSchool,
        'team': volunteerGroup,
        'jop': volunteerJop,
        'remarks': volunteerGroupLeader}, function(err){
        if (err !='') {
            res.send("修改失败：" + err);
        }
        else
        {
            pgclient.select('volunteer', {'id':id}, '', function(result) {
                if (result[0] === undefined) {
                    res.send('获取志愿者数据失败！');
                } else {
                    res.render('volunteers', {title: '更新志愿者信息', datas: result, users: res.locals.islogin});
                }
            });
        }
    });
});

// 删除志愿者
router.get('/del/:id', function(req, res){
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin) {
        pgclient.remove('volunteer', {'id':req.params.id},function(err){
            if (err != '') {
                res.send("删除失败：" + err);
            }
            else
            {
                res.send("<script>var con; con = confirm('删除成功，返回志愿者信息界面？是，返回志愿者界面；否，返回主页。');if (con == true){window.open('/volunteers','_self');}else{window.open('/home','_self');}</script>");
            }
        });
    } else {
        res.redirect('/login');
    }

});

router.get('/sendmail', function (req, res, next) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    if (res.locals.islogin) {
        res.render('sendmail',{title: '发送信息', users: res.locals.islogin});
    } else {
        res.redirect('/login');
    }
});


module.exports = router;