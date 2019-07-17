var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
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
/*查询*/
router.post('/data', function (req, res, next) {
    var param = req.body; //post取值
    var start = (param.pageNumber - 1) * 10;
    var selectUserAll = 'select c.collectId,c.collectType,c.create_dt,i.informationId,i.title from collect c  ' +
        ' join usermessage u on u.userId=c.userId ' +
        ' join information i on i.informationId=c.otherId ' +
        ' where c.userId=' + param.userId + '  and c.collectType=' + param.collectType +
        ' and c.collectId > ' + parseInt(start) + ' limit 10 ';
    var selectCount = 'select COUNT(*) as allCount from collect c  ' +
        'join usermessage u on u.userId=c.userId  ' +
        'join information i on i.informationId=c.otherId  ' +
        'where c.userId=' + param.userId + '  and c.collectType=' + param.collectType;
    var allCount = 0;
    var pageNumber = Number(param.pageNumber);
    var allPages = 0;
    pool.getConnection(function (err, connection) {
        connection.query(selectCount, null, function (err, result) {
            if (err) {
                result = result
            } else {
                allCount = result[0].allCount;
                allPages = Math.ceil(allCount / 10);
            }

        })
        connection.query(selectUserAll, null, function (err, result) {
            if (err) {
                result = result
            } else {
                if (result.length > 0) {
                    result = {
                        code: 200,
                        data: result,
                        allCount: allCount,
                        pageNumber: pageNumber,
                        allPages: allPages
                    };
                } else {
                    result = {
                        code: 400,
                        data: result,
                        allCount: 0,
                        pageNumber: 0,
                        allPages: 0
                    };
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*删除*/
router.post('/delete', function (req, res, next) {
    var sql = 'delete from collect where collectId=' + req.body.collectId;
    pool.getConnection(function (err, connection) {
        connection.query(sql, null, function (err, result) {
            if (err) {
                result = result
            } else {
                if (result.affectedRows <= 0) {
                    result = {
                        code: 400,
                        data: '删除失败'
                    }
                } else {
                    result = {
                        code: 200,
                        data: '删除成功'
                    }
                }

            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*操作*/
router.post('/collectOperation', function (req, res, next) {
    var sql = '';
    console.info(req.body.operation)
    if (req.body.operation) {
        sql = 'delete from collect where collectId=' + req.body.collectId;
    } else {
        sql = 'INSERT INTO collect(otherId,userId,collectType) VALUES('+req.body.informationId+','+req.body.userId+','+req.body.collectType+')';
    }
    pool.getConnection(function (err, connection) {
        connection.query(sql, null, function (err, result) {
            if(err){
                console.info(sql)
                result=result;
            }else{
                if (result.affectedRows <= 0) {
                    result = {
                        code: 400,
                        data: '操作失败'
                    }
                } else {
                    result = {
                        code: 200,
                        data: '操作成功'
                    }
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*根据id查询详情*/
router.post('/getById', function (req, res, next) {
    var collectNumber = 0;
    var pariseNumber = 0;
    var Messagesql = 'select * from collect c ' +
        'join information i on i.informationId=c.otherId ' +
        'where c.collectId=' + req.body.collectId;
    var Collectsql = 'select count(*) as allCount from information i join collect c on c.otherId=i.informationId where c.collectId=' + req.body.collectId;
    pool.getConnection(function (err, connection) {
        connection.query(Collectsql, null, function (err, result) {
            if (err) {
                result = result;
                responseJSON(res, result);
                connection.release();
            } else {
                collectNumber = result[0].allCount;
            }
        })
        connection.query(Messagesql, null, function (err, result) {
            if (err) {
                result = result;
            } else {
                if (result.length <= 0) {
                    result = {
                        code: 400,
                        data: {}
                    }
                } else {
                    var data = result[0];
                    data.collectNumber = collectNumber
                    result = {
                        code: 200,
                        data: data
                    }
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});

/*增加浏览值*/
router.post('/setBrowse', function (req, res, next) {
    var sql = 'update information set browseNumber=browseNumber+1 where informationId=' + req.body.informationId;
    pool.getConnection(function (err, connection) {
        connection.query(sql, null, function (err, result) {
            if (err) {
                result = result;
            } else {
                if (result.affectedRows <= 0) {
                    result = {
                        code: 400,
                        data: '增加浏览值失败'
                    }
                } else {
                    result = {
                        code: 200,
                        data: '增加浏览值成功'
                    }
                }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
});


module.exports = router;