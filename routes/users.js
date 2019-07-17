var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200', msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};
// 添加用户
router.get('/addUser', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
// 获取前台页面传过来的参数
        var param = req.query || req.params;
// 建立连接 增加一个用户信息
        connection.query(userSQL.insert, [param.uid, param.name], function (err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '增加成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();

        });
    });
});

/*查询*/
router.post('/data', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        connection.query(userSQL.queryAll, param, function (err, result) {
            if (err) {
                result = result
            } else {
                if (result.length > 0) {
                    result = {
                        code: 200,
                        data: result[0]
                    };
                } else {
                    result = {
                        code: 400,
                        data: result
                    };
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*登录*/
router.post('/login', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        connection.query(userSQL.getUserByCount, [req.body.userPwd, req.body.phone], function (err, result) {
            if (err) {
                result = result
            } else {
                if (result.length <= 0) {
                    result = {
                        code: 400,
                        data: result
                    }
                } else {
                    result = {
                        code: 200,
                        data: result[0]
                    }
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*修改*/
router.post('/update', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var params = [req.body.userName, req.body.userPwd, req.body.birthday, req.body.userlogo, req.body.sex, req.body.userId];
        connection.query(userSQL.updateUser, params, function (err, result) {
            if (err) {
                result = result
            } else {
                if(result.affectedRows>0){
                    result={
                        code:200,
                        data:'修改成功'
                    }
                }else{
                    result={
                        code:400,
                        data:'修改失败'
                    }
                }
            }
            responseJSON(res,result);
            connection.release();
        })
    })
});

module.exports = router;