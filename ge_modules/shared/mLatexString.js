

module.exports = class LatexString {
    
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