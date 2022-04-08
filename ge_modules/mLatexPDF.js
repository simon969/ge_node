const latex = require('node-latex')
const path = require('path');
const { fs, createReadStream, createWriteStream } = require('fs')
const { join, resolve } = require('path')
const latex_path = path.join(__dirname, '/latex_files');
const content_type = {  '.pdf': 'application/pdf',
                        '.tex': 'text/plain'}

module.exports = class LatexPDF {
    
    constructor () {
    }
    
    save_tex(raw_latex, file_name) {
        
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDay();
        let dir = path.join(latex_path,'/'+ year + '/' + month + '/' + day);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        this.input_file = resolve(join(__dirname, file_name));
        this.output_file = this.input_file.replace('.tex','.pdf');
        let writer = fs.createWriteStream(this.input_file) 
        // Read and display the file data on console 
        writer.write(raw_latex);
    
        return file_name; 
    }

    create_pdf() {
    this.input = createReadStream(this.input_file);
    this.output = createWriteStream(this.output_file);
    let options = {inputs: resolve(join(__dirname, 'tex-inputs')) // This can be an array of paths if desired
                    }
    latex(input, options).pipe(output);
    }
    }

 module.exports =  function download_file (res, fname) {
        if (fs.existsSync(fname)) {
            let ext = fname.substring(fname.indexOf('.'));
            let ct = content_type[ext]; 
            let data =fs.readFileSync(fname);
            res.contentType(ct);
            res.send(data);
        }
    }

    function download2 (res, fname) {
        if (fs.existsSync(fname)) {
            let ext = fname.substring(fname.indexOf('.'));
           
            var fileName = "C:\\Python27\\ArcGIS10.2\\python.exe";
            var file = path.basename(fileName);
            let ct = content_type[ext]; 
            let data = fs.createReadStream(fname);
            let stat = fs.statSync(fname);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', ct);
            res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
            data.pipe(res);
        }
    }
}
