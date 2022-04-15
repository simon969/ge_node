'use strict';
var express = require('express');
var router = express.Router();

// var sql = require("mssql");
// var config = require('../database/dbconnection');

var db = require("../database/database.js");
const { v4: uuidv4 } = require('uuid');

const crypto = require('crypto');
const LatexPDF = require('../ge_modules/mLatexPDF');
const { waitForDebugger } = require('inspector');

/* Get All Tasks */
router.get('/ge_task', function (req, res, next) 
    {
        let sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT  from ge_task order by createdDT_int DESC"
        let params = []
       
        if (req.query.owner) {
            sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT from ge_task where owner = ?  order by createdDT_int DESC"
            params = [req.query.owner]
        } 
        
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });
router.get('/ge_task/:ID', function (req, res, next) 
    {
        var sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT from ge_task where Id = ?"
        var params = [req.params.ID]
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });   
/* Get All Tasks */
// router.get('/ge_task/owner/:owner', function (req, res, next) 
//     {
//         var sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT from ge_task where owner = ?"
//         var params = [req.params.owner]
//         db.all(sql, params, (err, rows) => {
//             if (err) {
//               res.status(400).json({"error":err.message});
//               return;
//             }
//             res.json({
//                 "message":"success",
//                 "data":rows
//             })
//           });
//     });

/* Add Task */
router.post('/ge_task', function (req, res) {
    create_task(req, res);
});

/* Delete Task */
router.delete('/ge_task/:ID', function (req, res, next) {
    delete_task(req, res);    
});

/* Download file */
router.get('/ge_task/:ID/download/:filename', function (req, res) {

    var sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT from ge_task where Id = ?"
        var params = [req.params.ID]
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            if (rows[0].folder && rows[0].files) {
            let texpdf = new LatexPDF.LatexPDF(rows[0].folder, rows[0].files);
            let files = req.params.filename.toString().split(",");
            texpdf.download_files(files,res);
            } else {
                res.status(400).json({"error": "ge_task records contains no folder and/or files"})
            }
          });
});

/* Update ge_task*/
router.patch('/ge_task', function (req, res) {
    
    var data = {
        Id: req.Id,
        folder: req.body.folder,
        files: req.body.files,
        owner: req.body.owner,
        options : req.body.options
    }

    db.run(
        `UPDATE ge_task set 
           files = COALESCE(?,files), 
           folder = COALESCE(?,folder), 
           owner = COALESCE(?,owner), 
           options = COALESCE(?,options) 
           WHERE id = ?`,
        [data.files, data.folder, data.owner, data.options, req.params.Id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});

function create_task( req, res) {
    
    let texpdf = new LatexPDF.LatexPDF();
        
    if (req.body.latex) {
        texpdf.save_body_tex (req, res, function() {
            texpdf.create_pdfs (req, res, function () {
                create_tex_task(req, res, texpdf)});
        });
    } else {
        texpdf.save_form_tex (req, res, function() {
            texpdf.create_pdfs (req, res, function () {
                create_tex_task(req, res, texpdf)});
        });
    }

    if (!texpdf.files) {
        res.status(400).json({"error": "No tex found in body or form"})
    }

}

function create_tex_task (req, res, texpdf) {

    var data = {
        Id: uuidv4(),
        folder: texpdf.folder,
        files: texpdf.files(),
        owner:  texpdf.owner,
        options: texpdf.options,
        createdDT_int : Date.now()
    }
 
    var sql ='INSERT INTO ge_task (Id, folder, files, owner, options, createdDT_int) VALUES (?,?,?,?,?,?)'
    var params =[data.Id, data.folder, data.files, data.owner, data.options, data.createdDT_int]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
}

function delete_task (req, res) {
    var sql = "select Id, folder, files, owner, options, datetime(createdDT_int/1000,'unixepoch') as createdDT from ge_task where Id = ?"
    var params = [req.params.ID]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        } 
        
        if (rows.length == 0) { 
            res.status(400).json({"error":'record not found:' + req.params.ID});
            return;
        }

        if (!rows[0].folder || !rows[0].files) { 
            // folder and or files empty unable to delete files just delete ge_task record
            delete_tex_task (req, res)
        }
           
        let texpdf = new LatexPDF.LatexPDF(rows[0].folder, rows[0].files);

        texpdf.delete_files (texpdf.input_files, function () {
                texpdf.delete_files (texpdf.output_files, function () {
                    delete_tex_task (req, res);
                });
            });
        });

}

function delete_tex_task(req, res) {
    db.run(
        'DELETE FROM ge_task WHERE id = ?',
        req.params.ID,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
                res.status(204).json({"message":"deleted", changes: this.changes})
                return
        });

}
// function get_download(req, res) {
//     // https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs
//     // connect to your database
    
//     sql.connect(config, function (err) {
//         if (err) console.log(err);
//         var request = new sql.Request();
//         request.query('SELECT * FROM ge_task WHERE Id=/' +  req.params.ID + '/', function (err, recordset) {
//             if (err) console.log(err)
//             let texpdf = new LatexPDF.LatexPDF(recorde);
//             files = recordset.files.split(',');
//             file = files.filter(file => file.contains(req.params.filename));
//             download_file (file, res);
//         });
//     });
// }

module.exports = router;
