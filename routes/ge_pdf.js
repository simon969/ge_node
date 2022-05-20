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
const { maxFieldsExceeded } = require('formidable/src/FormidableError');



/* Get All Tasks */
router.get('/ge_task', function (req, res, next) 
    {
        let sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, datetime(created/1000,'unixepoch') as createdDT  from ge_task order by created DESC";
        let params = [];
       
        if (req.query.owner) {
            sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, datetime(created/1000,'unixepoch') as createdDT from ge_task where owner = ?  order by created DESC";
            params = [req.query.owner];
        } 
        
        if (req.query.type) {
            sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, datetime(created/1000,'unixepoch') as createdDT from ge_task where type = ?  order by created DESC";
            params = [req.query.type];
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
        var sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, datetime(created/1000,'unixepoch') as createdDT from ge_task where Id = ?"
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
    create_task(req, res) ;
});

/* Delete Task */
router.delete('/ge_task/:ID', function (req, res, next) {
    delete_task(req, res);    
});

/* Download file */
router.get('/ge_task/:ID/download/:filename', function (req, res) {

    var sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, dataclass, datetime(created/1000,'unixepoch') as createdDT from ge_task where Id = ?"
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
        dataclass : req.body.dataclass, 
        expires : req.body.expires,
        type : req.body.type,
        description : req.body.description,
        options : req.body.options
    }

    db.run(
        `UPDATE ge_task set 
           files = COALESCE(?,files), 
           folder = COALESCE(?,folder), 
           owner = COALESCE(?,owner), 
           options = COALESCE(?,options) 
           dataclass = COALESCE(?,dataclass); 
           expires = COALESCE(?,expires);
           type = COALESCE(?,type);
           description = COALESCE(?,description);
           WHERE Id = ?`,
        [data.files, data.folder, data.owner, data.options, data.dataclass, data.expires, data.type, data.description, data.Id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});
function first_not_null(values) {

    for (let i = 0; i < values.length; i++) {
        if (values[i]) {
            return values[i]
        };
    }

}
function file_content(latex_template, callback) {
        
    var ID = latex_template.ID;
        
    if (!ID) {
        ID = latex_template;
    }

    var sql = "select Id, folder, files, owner, dataclass, expires, type, description, options, datetime(created/1000,'unixepoch') as createdDT from ge_task where Id = ?"
    var params = [ID]
    db.all(sql, params, (err, rows) => {
        if (err) {
          callback (err, null)
        } else {
            try {
            
            let texpdf = new LatexPDF.LatexPDF(rows[0].folder, rows[0].files);
            let filename = first_not_null(new Array (latex_template.filename, 
                                                          texpdf.first_tex_file()));
            texpdf.file_content(filename, (err, content) => {
                                    callback (err, content);
                                });
            
            } catch (err) {
                callback (err, null);
            }
        }
      });
}
function create_task_body( body, callback) {
    
    let texpdf = new LatexPDF.LatexPDF();
    
    if (body.latex_template && body.json_data) {
            file_content(body.latex_template, (err, content) => {
                if (err) {
                    callback (err, texpdf);
                } else {
                    texpdf.save_tex_template (body, content, (err) => {
                        if (err) {
                            callback (err, texpdf);
                        } else {
                            texpdf.create_pdfs (() => {
                                callback(null, texpdf);
                            });
                        }
                    });
                }
            });
        } else {
            if (body.latex) {
                texpdf.save_tex (body, (err) => {
                    if (err) {
                        callback (err, texpdf);
                    } else {
                        texpdf.create_pdfs (() => {
                            callback(null, texpdf);
                        });
                    }
                });
            } else {
            callback (new Error("no latex or json data found in body"),null);
            }
        }

}

function create_task_form (req, callback) {
    
    let texpdf = new LatexPDF.LatexPDF();
    
    try {
        texpdf.get_form_tex (req, function(err, fields, files) {
                if (err) { 
                    callback(err);
                } else {
                    if (fields.latex_template) {
                        file_content (fields.latex_template, (err, template) => {
                            if (err) {
                                callback (err);
                            } else { 
                                texpdf.save_form_tex_template (fields, files, template, (err) => {
                                    if (err) {
                                        callback (err);
                                    } else {    
                                        texpdf.create_pdfs (() => {
                                            callback(null, texpdf);
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        texpdf.save_form_tex (fields, files, (err) => {
                            if (err) {
                                callback (err);
                            } else {    
                                texpdf.create_pdfs (() => {
                                    callback(null, texpdf);
                                });
                            }
                        });
                    }
                }
        });
        
    } catch (err) {
        callback (err, texpdf);
    } 
       
}

function create_task(req, res) {

        if (req.body) { 
            // res.json(req.body);
            create_task_body (req.body,  (err, texpdf) => {
                if (err) {
                    res.status(400).json({"error": err.message})
                } else {
                create_tex_task(res, texpdf);
                }
            });
        } else {
            create_task_form (req, (err, texpdf) => {
                if (err) {
                    res.status(400).json({"error": err.message})
                } else {
                create_tex_task(res, texpdf)
                }
            });
        }
}



function create_tex_task (res, texpdf) {

    var data = {
        Id: uuidv4(),
        folder: texpdf.folder,
        files: texpdf.files(),
        owner:  texpdf.owner,
        created : Date.now(),
        dataclass : texpdf.dataclass,
        description : texpdf.description,
        expires: texpdf.expires,
        type : texpdf.type, 
        options: texpdf.options,
    }
 
    var sql ='INSERT INTO ge_task (Id, folder, files, owner, created, dataclass, description, expires, type, options) VALUES (?,?,?,?,?,?,?,?,?,?)'
    var params =[data.Id, data.folder, data.files, data.owner, data.created, data.dataclass, data.description, data.expires, data.type, data.options]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message})
         }
            res.status(201).json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
      
    });
}

function delete_task (req, res) {
    var sql = "select Id, folder, files, owner, options, datetime(created/1000,'unixepoch') as createdDT from ge_task where Id = ?"
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
            // folder and or files empty just delete ge_task record
            delete_tex_task (req, res)
        } else {
           
            let texpdf = new LatexPDF.LatexPDF(rows[0].folder, rows[0].files);
            
            texpdf.delete_all_files_and_folder ( (err) => {
                    if (err) {
                        res.status(400).json({"error": res.message})
                        return;
                    }
                    delete_tex_task (req, res);
            });
        }
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
