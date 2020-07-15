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

//차단된 학장자 목록
router.get('/', function (req, res, next) {
    var sql = "select e.EXT_NO, e.EXT_NAME, e.EXT_CREATETIME ,t.TEAM_NAME, t.TEAM_NO FROM extension AS e LEFT JOIN team AS t ON e.EXT_TEAM = t.TEAM_NO";
    var query = connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        res.render('select', {
            title: 'MADRAS_CHECK',
            ext_select: rows
        });
    });
});

router.get('/:teamNo', function (req, res, next) {
    var teamNo = req.params.teamNo;
    var checkTeamSql = "select * from team where TEAM_NO =" + teamNo;
    var checkQuery = connection.query(checkTeamSql, function(err, rows) {
        if(err) {
            throw err;
        }
        if(rows[0] == undefined){
            res.redirect('/ext_select');
        } else {
            var sql = "select e.EXT_NO, e.EXT_NAME, e.EXT_CREATETIME ,t.TEAM_NAME, t.TEAM_NO FROM extension AS e LEFT JOIN team AS t ON e.EXT_TEAM = t.TEAM_NO where t.TEAM_NO='" +teamNo +"'";
            var query = connection.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                }
                res.render('add', {
                    title: 'MADRAS_CHECK',
                    ext_select: rows,
                    teamNo : teamNo
                });
            });
        }
    })
    
});

module.exports = router;