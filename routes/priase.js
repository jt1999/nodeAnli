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


/*查询本人点赞*/
router.post('/count',function (req,res,next) {
    var sql='select count(*) as priaseCount from priase where userId='+req.body.userId+' and informationId='+req.body.informationId;
    pool.getConnection(function (err,connection) {
        connection.query(sql,null,function (err,result) {
            if(err){
                result=result;
            }else{
               if(result[0].priaseCount>0){
                   result={
                       code:200,
                       data:{
                           isPriase:0
                       }
                   }
               }else{
                   result={
                       code:200,
                       data:{
                           isPriase:1
                       }
                   }
               }
            }
            responseJSON(res, result);
            connection.release();
        })
    })
})


module.exports = router;