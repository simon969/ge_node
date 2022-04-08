'use strict';
var express = require('express');
var router = express.Router();
var sql = require("mssql");
var config = require('../database/dbconnection');
const {LatexPDF, download_file} = require('../ge_modules/mLatexPDF');

/* Get All Tasks */
router.get('/ge_task', function (req, res) {
    sql.connect(config.dbConnection()).then(() => {
        return sql.query("SELECT * FROM ge_task;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});
/* Add Task */
router.post('/ge_task/add', function (req, res) {
    sql.connect(config.dbConnection()).then(() => {
        return sql.query("INSERT INTO ge_task VALUES('" + req.body.owner + "', " + req.body.latex + ")");
    }).then(result => {
        res.status(200).send("Student Added Successfully.");
    }).catch(err => {
        res.status(415).send("Something Went Wrong !!!");
    })
});
/* Delete Student */
router.get('/ge_task/delete/:ID', function (req, res) {
    sql.connect(config.dbConnection()).then(() => {
        return sql.query("DELETE FROM StudentInfo WHERE ID = " + req.params.ID);
    }).then(result => {
        res.status(200).send("Student Deleted Successfully.");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});

/* Download tex file */
router.get('/ge_task/download/:ID/tex', function (req, res) {
    download(req,res,'.tex');
});
/* Download pdf file */
router.get('/ge_task/download/:ID/pdf', function (req, res) {
    download(req,res,'.pdf');
});
/* Update Student */
router.post('/updateStudent', function (req, res) {
    sql.connect(config.dbConnection()).then(() => {
        return sql.query("UPDATE StudentInfo SET [Name] = '" + req.body.Name + "', Age = " + req.body.Age + " WHERE ID = " + req.body.ID);
    }).then(result => {
        res.status(200).send("Student Updated Successfully.");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});
module.exports = router;


function create_task( req, res) {
    files = req.body.filename
    sql.connect(config, function (err) {
        if (err) console.log(err);
            var request = new sql.Request();
            request.query('INSERT INTO ge_task VALUES(' + req.body.owner + "', " + req.body.latex + ")"), function (err, recordset) {
                if (err) console.log(err)
                files = recordset.files.split(',');
                file = files.filter(file => file.contains(ext));
                download_file (res, file);
        });
    });
   );
}

function get_download(req, res, ext) {
    // https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs
    // connect to your database
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM ge_task WHERE Id=/' +  req.params.ID + '/', function (err, recordset) {
            if (err) console.log(err)
            files = recordset.files.split(',');
            file = files.filter(file => file.contains(ext));
            download_file (res, file);
        });
    });
}
