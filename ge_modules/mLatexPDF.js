
const {spawn} = require('child_process');
const path = require('path');
const {mkdirSync, existsSync, readFileSync, createReadStream, writeFileSync, createWriteStream, fstat, renameSync, unlinkSync} = require('fs')
const { join, resolve } = require('path')
const latex_path = path.join(__dirname, '/latex_files');

var formidable = require('formidable');

const content_type = {  '.pdf': 'application/pdf',
                        '.tex': 'text/plain',
                        '.log': 'text/plain',
                        '.aux': 'text/plain'}
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

module.exports.LatexPDF = class LatexPDF {

        constructor (folder, files) {
            
            if (folder) {
                this.folder = folder;
            } else {
                let year = new Date().getFullYear();
                let month = '0' + (new Date().getMonth() + 1);
                let day = '0' + new Date().getDate();
                this.folder = '/'+ year + '/' + month.substring(month.length-2) + '/' + day.substring(day.length-2);
                
                let folder = path.join(latex_path,this.folder);

                if (!existsSync(folder)) {
                    mkdirSync(folder, { recursive: true });
                }
            }
            if (files) {
                this.input_files = files.toString().split(",").filter(name => name.includes('.tex'));
                this.output_files = files.toString().split(",").filter(name =>  name.includes('.pdf') | 
                                                                                name.includes('.aux') |
                                                                                name.includes('.log'));
            } else {
                this.input_files = [];
                this.output_files = [];
            }

        }
       
        save_body_tex (req, res, callback) {

            if (req.body) {
                if (req.body.latex) {
            
                    if (!req.body.owner) {
                    res.status(400).json({"error": "owner empty"});
                    return;
                    } else {
                        this.owner = req.body.owner;
                    }
                    
                    let latex_file = "ge_file.tex"
            
                    if (!req.body.filename){
                        latex_file = req.body.filename;  
                    }
                
                    this.save_tex_string(req.body.latex,latex_file, callback);
                }

                
            }
            
        }

        save_form_tex (req, res, callback) {

            // https://stackoverflow.com/questions/10124099/do-stuff-with-multiple-files-when-uploading-them-using-node-formidable-with-expr
            // https://stackoverflow.com/questions/30530099/how-to-restrict-file-types-with-formidable-js
                
                
               
                var form = new formidable.IncomingForm(),
                _files = [],
                _fields = [];
                form.on('field', function(field, value) {
                    console.log (field, value);
                    _fields[field] = value; 
                });
                form.on('file', function(field, file) {
                    console.log(file.originalFilename);
                    _files.push(file);
                });
                form.on('end', function() {
                    console.log('done');
                });
                form.uploadDir = path.join(latex_path,this.folder);
                form.parse(req, (err, fields, files) => this._process_files(err, _fields, _files, callback));
               
                    
               
        
        }
        _process_files (err, fields, files, callback) {

                if (err) {
                    console.error(err.message);
                    //         return;  
                }
                
                if (fields) {
                    
                    if (fields.owner) {
                    this.owner = fields.owner;
                    }
                    
                    if (fields.latex) { 
                        let latex_file = "ge_file.tex"
                        
                        if (fields.filename) {
                            latex_file = fields.filename;
                        }
                        if (!files && callback) {
                            this.save_tex_string(fields.latex,latex_file, callback);
                        } else {
                          this.save_tex_string(fields.latex,latex_file);
                        }
                    }

                    
                }

                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        let pf = files[i];
                        var oldPath = pf.filepath
                        var newPath = path.join(latex_path,this.folder, this.push_file_in(pf.originalFilename))
                        renameSync(oldPath, newPath, function (err) {
                            if (err) {
                                // Check for and handle any errors here.
                                console.error(err.message);
                            }
                            
                        })
                        console.log('Successfully moved:' + oldPath + ' to:' + newPath);
                        if ((i==files.length - 1) && callback) { 
                                callback();        
                        }
                    }
                }

        }
        
        save_tex_string(raw_latex, file_name, callback) {
            
            if (!file_name) {
                return 
            }

            let file_in =  this.push_file_in(file_name)
  
            let full_file_in = resolve(join(latex_path,this.folder, file_in));
            let latex = raw_latex.replace(/\\n/g,"\n").replace(/\\\\/g,"\\");
            try {
                writeFileSync(full_file_in, latex)
                //file written successfully
                if (callback) {callback()};
              } catch (err) {
                console.error(err)
              }

        }
        
        push_file_in (file_name) {
            let rand = Math.floor(100000 + Math.random() * 900000);
            let file_in = file_name.replace('.tex',rand + '.tex');
            this.input_files.push(file_in);
            this.output_files.push(file_in.replace('.tex','.pdf'));
            this.output_files.push(file_in.replace('.tex','.log'));
            this.output_files.push(file_in.replace('.tex','.aux'));
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

        create_pdfs(res, req, callback) {
           
            let folder = resolve(join(latex_path,this.folder));

            for (let i = 0; i < this.input_files.length; i++) {
                // https://stackoverflow.com/questions/3482901/is-it-possible-to-compile-a-latex-document-via-node-js
                
               // let pdflatex = spawn('pdflatex', [folder, folder, this.input_files[i]]);
                
               let pdflatex = spawn('pdflatex', ['-output-directory', folder, folder + '\\' + this.input_files[i]])
                
                pdflatex.on('exit', function (code) {
                console.log('pdflatex process exited with code ' + code);
                });
                
                if ((i==this.input_files.length-1) && (callback)) {
                    callback();
                 }

            }
          
                
        }
        xcreate_pdfs(res, req, callback) {

            for (let i = 0; i < this.input_files.length; i++) {
                
                let options = {inputs: resolve(join(latex_path, 'tex-inputs'))}; 
                let input = createReadStream(resolve(join(latex_path,this.folder,this.input_files[i])));
                let output = createWriteStream(resolve(join(latex_path,this.folder,this.output_files[i])));
                
                latex(input, options).pipe(output);

                if ((i==this.input_files.length-1) && (callback)) {
                   callback();
                }
            }
          
                
        }
        delete_all_files(res, callback) {
            this.delete_files (this.input_files, function () {
                this.delete_files (this.output_files, callback);
                });
        }
        
        delete_files (files, callback) {
            
            for (let i = 0; i < files.length; i++) {
                    let file = resolve(join(latex_path,this.folder,files[i]));
                    if (existsSync(file)) {
                        try {
                        unlinkSync(file);
                        console.log('file deleted: ' + file);
                        } catch (err) {
                            console.log('Unable to delete: ' + file); 
                        }
                    } else {
                        console.log('file not found: ' + file);
                    }
                    if ((i==files.length-1) && (callback)) {
                        callback();
                    }
                }
        }

        download_files (files, res) {

            for (let i = 0; i < files.length; i++) {
                let filename= files[i]
                let file = resolve(join(latex_path,this.folder, filename));
                if (existsSync(file)) {
                    let ext = file.substring(file.indexOf('.'));
                    let ct = content_type[ext]; 
                    let data = readFileSync(file);
                    res.contentType(ct);
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
    
    documentclass(f, s) {
        
        this.pline = '\\documentclass';

        if (f) {
           this.pline =+ '[' + f + ']' 
        }
        if (s) {
           this.pline =+ '{' + s + '}' 
        }
        
        this.content.push(this.pline)
    }
    title(s) {
        this.content.push('\\title{' + s + '}');
    }
    caption(s) {
        this.content.push('\\caption{' + s + '}');
    }
    label(s) {
        this.content.push('\\label{' + s + '}');
    }
    begin(n, f, s) {
        if (n) { 
           this.pline = '\\begin{' + n + '}'
        }
        if (f) {
           this.pline =+ '[' + f + ']'
        }
        if (s) {
           this.pline =+ '{' + s + '}'
        }
        this.content.push(this.pline)   
        
    }

    add (s, endline = true) {
        
        if (s && endline == false) {
            if (this.pline) {
               this.pline += ' & ' + s 
            } else {
               this.pline = s;
            }
        }
        
        if (s && endline == true) {     
            this.content.push(this.pline);
            this.pline = null;
        }
    }

    textbf (s, endline = true) {
        let s2 = '\\textbf{' + s + '}';
        this.add (s2, endline);
    }
    end(s) {
        this.content.push('\\end{' + s + '}');
    }
    
    usepackage (s,f) {
       this.pline = '\\usepackage'
        if (f) {
           this.pline += '[' + f + ']'
        }
        if (s) {
           this.pline += '{' + s +'}'
        }
        this.content.push (this.pline);
    }
    
    
    toString() {
        return this.content.join('/n');   
    }

}