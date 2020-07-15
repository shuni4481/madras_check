var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'madras_check'
});
connection.connect();

//차단된 학장자 수정
router.post('/', function (req, res, next) {
    var teamNo = req.body.teamNo;
    var extList = req.body.extList;
    if(typeof extList == "string") extList = extList.split(",");
    var reduceExtList = extList.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]); //중복 제거
    var sql = "select * from extension where EXT_TEAM ='" +teamNo+ "'";
    var query = connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        var existedExtList = []; //존재하고 있는 차단된 확장자 목록
        for(var i = 0; i < rows.length; i++) {
            existedExtList.push(rows[i].EXT_NAME);
        }
        for(var i = 0; i < reduceExtList.length; i++) {
            if(!existedExtList.includes(reduceExtList[i])) { //중복 체크
                //db 삽입
                var insertSql = "INSERT INTO extension (EXT_NAME, EXT_TEAM, EXT_CREATETIME) VALUES ('" +reduceExtList[i]+ "'," + teamNo +", now())";  
                var query = connection.query(insertSql, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        res.redirect('/ext_select/' + teamNo);        
    });
});
module.exports = router;