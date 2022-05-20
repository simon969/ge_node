
const {spawn} = require('child_process');
const path = require('path');
const {mkdirSync, existsSync, writeFile, renameSync, unlinkSync, rmdir, readFileSync} = require('fs')
const {join, resolve } = require('path')
const latex_path = path.join(__dirname, '/latex_files');

var latex_filename = "ge_file.tex"

var formidable = require('formidable');
const { json } = require('express/lib/response');
const { isArray } = require('util');

const content_type = {  '.pdf': 'application/pdf',
                        '.tex': 'text/plain',
                        '.log': 'text/plain',
                        '.aux': 'text/plain',
                        '.eps': 'application/eps',
                        '.jpeg': 'image/jpeg',
                        '.jpg': 'image/jpg',
                        '.jpe': 'image/jpe',
                        '.png': 'image/png',
                        '.json': 'application/json'}

// const { randomUUID } = require('crypto'); // Added in: node v14.17.0
// const { Console } = require('console');
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 
function isNullOrEmpty (obj) {
    
    if (obj == undefined || obj == null) {
        return false;
    }
   
    return Object.keys(obj).length == 0; 
   
}
function asObject(data, callback) {
    try {
        if (isObject(data)) {
            return data;
        } else {
            return JSON.parse(data);
        }
    }
    catch (err) {
        callback (err);
    }
}

function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

module.exports.LatexPDF = class LatexPDF {

        constructor (folder, files) {
            
            if (folder) {
                this.folder = folder;
            } else {
                let year = new Date().getFullYear();
                let month = '0' + (new Date().getMonth() + 1);
                let day = '0' + new Date().getDate();
                let rand = Math.floor(100000 + Math.random() * 900000);
                this.folder = '/'+ year + '/' + month.substring(month.length-2) + '/' + day.substring(day.length-2)  + '/' + rand;
                
                let folder = path.join(latex_path,this.folder);
                this.ensure_folder(folder);
                
            }
            if (files) {
                this.input_files = files.toString().split(",").filter(name => name.includes('.tex'));
                this.output_files = files.toString().split(",").filter(name =>  ! name.includes('.tex'));
            } else {
                this.input_files = [];
                this.output_files = [];
            }

        }
        
        save_tex_template (data, template, callback) {
            
                if (data.json_data && template) {
                    
                    this.owner = data.owner;
                    this.dataclass = data.dataclass; 
                    this.expires = data.expires;
                    this.type = data.type;
                    this.options = data.options;
                    this.description = data.description;
                    
                    if (data.filename){
                        latex_filename = data.filename;  
                    }
                    
                    let json_filename = latex_filename.replace(".tex",".json");

                    this.save_string(data.json_data, json_filename, ()=> {
                        this._process_template (data.json_data, template, (err, new_latex) => {
                            if (err) {  
                                callback (err);
                            } else { 
                            this.save_string(new_latex, latex_filename, callback);
                            }
                        });
                    });
                } 
        }
       
        _process_template(json_data, template, callback) {

            let latex_array = [];
            let new_latex = template;
            
            let data = asObject(json_data, (err) => {
                if (err) {
                    callback (err, null);
                }
            });

            // process properties of req.latex_data
            
            try { 
            
                if (Array.isArray(data)) {
                    for (i =0; i < data.length; i++) {
                        let obj = data[i];
                        new_latex = template;
                        for (let x in obj) {
                            let val = obj[x];
                            let xno_ = x.toString().replace("_","");
                            new_latex = new_latex.replace(`\\newcommand{\\${xno_}}{0}`, `\\newcommand{\\${xno_}}{${val}}`);
                        }
                        latex_array.push(latex);
                    }
                    new_latex = latex_array.join('');
                    callback (null, new_latex);
                } else {
                    for (let x in data) {
                        let val = data[x];
                        let xno_ = x.toString().replace("_","");
                        new_latex = new_latex.replace(`\\newcommand{\\${xno_}}{0}`, `\\newcommand{\\${xno_}}{${val}}`);
                    }
                    callback (null, new_latex);
                }
            } catch (err) {
                console.log(err); 
                callback (err, null);
            }

        }
        
        first_tex_file () {
            return this.first_includes(this.input_files,".tex");
        }
        
        first_includes(array, includes) {
            let incl = array.filter((str) => { return str.includes(includes); });
            if (incl) {
                return incl[0];
            } else {
                return null;
            }
        }

       
        save_tex (data, callback) {

          try {
                    this.owner = data.owner;
                    this.dataclass = data.dataclass; 
                    this.expires = data.expires;
                    this.type = data.type;
                    this.options = data.options;
                    this.description = data.description;
                    
                    if (!data.filename) {
                        latex_filename = data.filename;  
                    }
                
                    this.replace_escaped(data.latex, (err, latex)=>{
                        if (!err) {
                            this.save_string(latex, latex_filename, callback);
                        }
                    })
                }
            catch (err) {
            callback (err)
            }
        }

        get_form_tex (req, callback) {

            // https://stackoverflow.com/questions/10124099/do-stuff-with-multiple-files-when-uploading-them-using-node-formidable-with-expr
            // https://stackoverflow.com/questions/30530099/how-to-restrict-file-types-with-formidable-js
                
                
                var form = new formidable.IncomingForm(),
                _files = [],
                _fields = [];

                form.on('field', function(field, value) {
                    // console.log (field, value);
                    _fields[field] = value; 
                });
                
                form.on('file', function(field, file) {
                    // console.log(file.originalFilename);
                    _files.push(file);
                });
                
                form.on('end', function() {
                   // console.log('form read complete');
                });
                
                form.uploadDir = path.join(latex_path,this.folder);
                
                form.parse(req, (err, fields, files) => {
                    callback(err, _fields, _files)
                });

                //    form.parse(req, (err, fields, files) => this.save_form_tex (err, _fields, _files, callback));
               
                    
               
        
        }
        save_form_tex_template (fields, files, template, callback) {
            
            if (fields) {
                
                    this.owner = fields.owner;
                    this.dataclass = fields.dataclass; 
                    this.expires = fields.expires;
                    this.type = fields.type;
                    this.options = fields.options;
                    this.description = fields.description;
                    
                if (fields.json_data) { 
                  
                    if (fields.filename) {
                        latex_filename = fields.filename;
                    }
                    
                    let json_filename = latex_filename.replace(".tex",".json");

                    this.save_string(fields.json_data, json_filename, (err) => {
                        if (err) {
                            callback(err);
                        } 
                        this._process_template (fields.json_data, template, (err, new_latex) => {
                            if (err) {  
                                callback(err);
                            }
                            this.save_string(new_latex, latex_filename, (err) => {
                                if (err) {
                                    callback(err);
                                }                        
                                if (isNullOrEmpty(files)) { 
                                    callback();
                                }
                            });
                        });      
                    });
                }
            }

            if (!isNullOrEmpty(files)) {
                this.ensure_folder(this.folder); 
                
                let renamefiles = files.filter(f=>f.originalFilename!='');
                
                if (renamefiles.length==0) {
                    callback();
                } else {
                
                    for (let i = 0; i < renamefiles.length; i++) {
                        let pf = renamefiles[i];
                        var oldPath = pf.filepath
                        var newPath = path.join(latex_path,this.folder, this.push_file_in(pf.originalFilename))
                        renameSync(oldPath, newPath, function (err) {
                            if (err) {
                                // Check for and handle any errors here.
                                console.error(err.message);
                                callback(err);
                            }
                        })
                        console.log('Successfully moved:' + oldPath + ' to:' + newPath);
                        
                        if (i==renamefiles.length - 1) { 
                            let json_filename = this.input_files.filter(function (str) { return str.includes(".json"); });
                            if (json_filename) {
                                    this.file_content(json_filename, (err, json_data) => {
                                        if (err) {  
                                            // Check for and handle any errors here.
                                            console.error(err.message);
                                            callback(err);
                                        } 
                                        this._process_template (json_data, template, (err, new_latex) => {
                                            if (err) {  
                                                callback (err)
                                            } 
                                            this.save_string(new_latex, latex_filename, (err) => {
                                                if (err) {
                                                    callback(err);
                                                }
                                                callback();
                                            });
                                        });
                                    });
                                
                            } else {
                                callback ({ err: raise ("No json_data file found for processing")
                                        });
                            }
                        }
                    }
                }
            } 
        }
// /**
//  * @param {string} data
//  * @param {string} data
//  * @param {string} file_name 
//  * @callback {function} callback (err)
//  *
//  **/
        save_form_tex (fields, files, callback) {

            if (fields) {

                this.owner = fields.owner;
                this.dataclass = fields.dataclass; 
                this.expires = fields.expires;
                this.type = fields.type;
                this.options = fields.options;
                this.description = fields.description;

                if (fields.latex) { 
                    let latex_file = "ge_file.tex"  
                    
                    if (fields.filename) {
                        latex_file = fields.filename;
                    }
                    this.replace_escaped(fields.latex, (err, latex)=>{
                        if (err) {
                            console.error(err.message);
                            callback (err);  
                        }
                        this.save_string(latex, latex_file, (err) => {
                            if (err) {
                                    console.error(err.message);  
                                    callback (err)   
                                }
                            if (isNullOrEmpty(files)) {
                                callback();
                            }
                        });
                        
                    })
                    
                }

            }

            if (!isNullOrEmpty(files)) {

                this.ensure_folder(this.folder); 

                let renamefiles = files.filter(f=>f.originalFilename!='');
                
                if (renamefiles.length==0) {
                    callback();
                } else {
                    for (let i = 0; i < renamefiles.length; i++) {
                    let pf = renamefiles[i];
                    var oldPath = pf.filepath
                    var newPath = path.join(latex_path,this.folder, this.push_file_in(pf.originalFilename))
                    renameSync(oldPath, newPath, function (err) {
                        if (err) {
                            // Check for and handle any errors here.
                            console.error(err.message);
                        }
                        
                    })
                    console.log('Successfully moved:' + oldPath + ' to:' + newPath);
                    if ((i == renamefiles.length - 1)) { 
                            callback();        
                    }
                    } 
                }
            } 
        }

        replace_escaped(latex, callback) {
          
          try {
            let new_latex = latex.replace(/\\n/g,"\n").replace(/\\\\/g,"\\");
                callback (null, new_latex); 
          } 
          catch (err) {
            console.log(err);
                callback (err);
          }
           
         }
/**
 * @param {string} data
 * @param {string} file_name 
 * @callback {function} callback (err)
 *
 **/
        save_string(data, file_name, callback) {
            
            try {

                if (!data || !file_name) {
                    throw "latex string and or filename empty";
                }

                let file_in =  this.push_file_in(file_name)
    
                let full_file_in = resolve(join(latex_path,this.folder, file_in));
               
                writeFile(full_file_in, data, (err) => {
                    if (err) {
                        console.log(`unable to write file ${full_file_in}`)
                    } else {
                        console.log(`file written ${full_file_in}`) 
                    }
                    callback (err);
                }); 
               
            } catch (err) {
                console.error (err) 
                callback (err);
            }
        }
            
       
        ensure_folder (folder) {
            if (!existsSync(folder)) {
                mkdirSync(folder, { recursive: true });
            }
        }
        
        push_file_in (file_name) {
           // let rand = Math.floor(100000 + Math.random() * 900000);
           // let file_in = file_name.replace('.tex',rand + '.tex');
            let file_in = file_name; 
            this.input_files.push(file_in);
            if (file_in.indexOf('.tex') !== -1) {
                this.output_files.push(file_in.replace('.tex','.pdf'));
                this.output_files.push(file_in.replace('.tex','.log'));
                this.output_files.push(file_in.replace('.tex','.aux'));
            }
            return file_in; 
        }

        files_with_folder () {
            let files_in = [];
            let files_out = [];
            for (let i = 0; i < this.input_files.length; i++) { 
                files_in.append(resolve(join(this.folder, this.input_files[i])));
                files_out.append(resolve(join(this.folder, this.input_files[i])));
            }      
            return this.files_in.join(',') + this.files_out.join(',');
        }
        
        files () {
           return this.input_files.join(',') + ',' + this.output_files.join(',');
        }

        create_pdfs (callback) {
           
            let folder = resolve(join(latex_path,this.folder));
            let tex_files = [];
            
            tex_files = this.input_files.filter(name => name.includes('.tex'));
            
            for (let i = 0; i < tex_files.length; i++) {
               
               // https://stackoverflow.com/questions/3482901/is-it-possible-to-compile-a-latex-document-via-node-js
               
               let tex_file = folder + '\\' + tex_files[i];

               if (existsSync(tex_file)) { 
                    console.log ()
                    let pdflatex = spawn('pdflatex', ['-output-directory', folder, tex_file])
                        
                        pdflatex.stdout.on('data', (data) => {
                            console.log(`stdout: ${data}`);
                        });
                      
                        pdflatex.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });
                                        
                        pdflatex.on('exit', function (code) {
                        console.log('pdflatex process exited with code ' + code);
                        });
                }

                if ((i==tex_files.length-1)) {
                    callback();
                }

            }
                
        }

        delete_all_files_and_folder (callback) {
            this.delete_files (this.input_files,  (err) => {
                this.delete_files (this.output_files, (err) => {
                    this.delete_folder( () => {
                        callback()
                    });
                });
            });
        }

        delete_folder (callback) {
            rmdir (this.folder, { recursive: true }, () => {
                console.log(`folder ${this.folder} deleted`);
                callback();
                });
        }

        delete_files (files, callback) {
            
            let valid_files = [];
            
            if (Array.isArray(files)) {
                valid_files = files.filter(name=>name != '');
            } else {
                if (files != '') {
                    valid_files.append(files);
                }
            }
            if (valid_files.length==0) {
                callback();
            } else {
            for (let i = 0; i < valid_files.length; i++) {
                    let file = resolve(join(latex_path,this.folder,valid_files[i]));
                    if (existsSync(file)) {
                        try {
                        unlinkSync(file);
                        console.log('file deleted: ' + file);
                        } catch (err) {
                            console.log('Unable to delete: ' + file);
                            callback(err); 
                        }
                    } else {
                        console.log('file not found: ' + file);
                    }
                    if ((i==valid_files.length-1) && (callback)) {
                        callback();
                    }
                }
            }
        }

        file_content (filename, callback) {
            
                try {
                    
                    if (Array.isArray(filename)) {
                    filename = filename[0];
                    }

                    let file = resolve(join(latex_path,this.folder, filename));
                    
                    var data = readFileSync(file, {encoding:'utf8', flag:'r'});
                } catch (err) {
                    callback (err, null);
                } 

                callback (null, data);
        }

        download_files (files, res) {

            for (let i = 0; i < files.length; i++) {
                let filename= files[i]
                let file = resolve(join(latex_path,this.folder, filename));
                if (existsSync(file)) {
                    let ext = file.substring(file.indexOf('.'));
                    if (content_type[ext]) {
                         res.contentType(content_type[ext]); 
                    }
                    let data = readFileSync(file);
                    res.send(data);
                } else {
                    console.log('file not found: ' + file);
                    res.status(400).json({"error": "file not found:" + filename});
                }
            }
        }
    }

    // function download2 (fname, res) {
    //     if (fs.existsSync(fname)) {
    //         let ext = fname.substring(fname.indexOf('.'));
           
    //         var fileName = "C:\\Python27\\ArcGIS10.2\\python.exe";
    //         var file = path.basename(fileName);
    //         let ct = content_type[ext]; 
    //         let data = fs.createReadStream(fname);
    //         let stat = fs.statSync(fname);
    //         res.setHeader('Content-Length', stat.size);
    //         res.setHeader('Content-Type', ct);
    //         res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    //         data.pipe(res);
    //     }
    // }



// class ge_task {

//     constructor (owner, files, options) {
//         gt.Id = randomUUID();
//         this.owner = owner;
//         this.createdDT = Date.now(); 
//         this.files = files;
//         this.options = options;
//     }
// }

// https://stackabuse.com/how-to-use-module-exports-in-node-js/

// module.exports.new_task = function new_task(owner, files, options) {
//         return new ge_task(owner, files, options);
// }

// module.exports.latexPDF = function latexPDF () {
//         return new LatexPDF();
// }
module.exports.LatexString = class LatexString {
    
    constructor() {
    this.content = [];
    this.pline = null;
    }
    
    documentclass(s) {
        this.esc('documentclass') 
        this.brace(s); 
    }

    title(s) {
        this.esc('title')
        this.brace(s);
    }
    caption(s) {
        this.esc('caption')
        this.brace(s);
    }
    label(s) {
        this.esc('label')
        this.brace(s);
    }
    begin(s) {
        this.esc('begin');
        this.brace(s);
    }
    
    brace (s) {
        this.add('{' + s + '}');
    }
    
    square (s) {
        this.add('[' + s + ']');
    }

    cr () { 

        if (this.pline) {
        this.content.push(this.pline);
        }

        this.pline = null;  
    }
    al (s) {
        this.add(s,true);
    }
    add (s, endline = false) {
        
        if (this.pline) {
            this.pline += s 
        } else {
            this.pline = s;
        }

        if (endline == true) {     
          this.cr();
        }
    }
    amp (s, endline = false) {
        this.add (' & ' + s, endline);
    }
    
    esc (s, endline = false) {
        this.add ('\\' + s, endline );
    }
    
    textbf (s, endline = false) {
        this.esc ('textbf')
        brace (s);
    }

    end(s) {
        this.esc('end{' + s + '}', true);
    }
    
    usepackage (s,f) {
    
        this.esc('usepackage');
        if (f) {
           this.add('[' + f + ']');
        }
        if (s) {
           this.add('{' + s +'}')
        }
        this.cr();
    }
    
    
    toString() {
        
        if (this.pline!='') {
            this.cr();
        }

        return this.content.join('');   
    }

}