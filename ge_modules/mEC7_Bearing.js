// import cEC7_Bearing_Capacity from 'cEC7_Bearing_Capacity'; 
//' ==========================================================================================
//' Design bearing resistances calculated from EC-7 EN 1997-1:2004
//'
//' Equation D.2 Drained conditions
//' Equation D.1 Undrained conditions
//' ==========================================================================================
//' Coded  | Simon Thomson
//' ==========================================================================================
//' Company | AECOM
//' ==========================================================================================
//' Date            |     Version   |         Description 
//' ==========================================================================================
//  April 2010      |    01.00.00   | Coded for Excel VBA addin             
//  Dec 2021        |    02.00.00   | Coded for Excel JavaScript addin           
//' ==========================================================================================

// export default
const constPI = 3.14159

const { get } = require('express/lib/response');
const LatexString = require('../ge_modules/mLatexPDF');

function isNullOrEmpty(obj) {
    
    if (obj == undefined || obj == null) {
        return false;
    }

    return Object.keys(obj).length === 0;
}

class cEC7_DrainedBearingResistanceD2 {
 
        constructor (data) {

            // this.htheta_rad = constPI / 2.00;
            // this.hload = 0;
            // this.vload = 0;
            // this.alpha_rad = 0;

            if (!isNullOrEmpty(data)) {
                if (data.breadth != undefined) this.breadth = parseFloat(data.breadth);
                if (data.length != undefined) this.length = parseFloat(data.length); 
                if (data.area != undefined) this.area = parseFloat(data.area);
                
                if (data.hload != undefined) this.hload = parseFloat (data.hload);
                if (data.vload != undefined) this.vload = parseFloat (data.vload) ;
                if (data.htheta_rad  != undefined) this.htheta_rad = parseFloat(data.htheta_rad);
                if (data.alpha_rad  != undefined) this.alpha_rad = parseFloat(data.alpha_rad);
            
                if (data.density  != undefined) this.density = parseFloat(data.density);
                if (data.phi_rad  != undefined) this.phi_rad = parseFloat(data.phi_rad);
                if (data.cohesion  != undefined) this.cohesion = parseFloat(data.cohesion);
                if (data.surcharge  != undefined) this.surcharge = parseFloat(data.surcharge);

                if (data.references  != undefined) this.references = this._references();
                if (data.limitations != undefined) this.limitations = this._limitations();
                if (data.param_descriptions != undefined) this.param_descriptions = this._param_descriptions();
                if (data.function_descriptions != undefined) this.function_descriptions =this. _function_descriptions();
                
                if (data.options != undefined) {
                    if ('param_descriptions' in data.options) this.param_descriptions = this._param_descriptions();
                    if ('function_descriptions' in data.options) this.param_descriptions = this._function_descriptions();
                    if ('references' in data.options) this.references = this._references();
                    if ('limitations' in data.options) this.limitations = this._limitations();
                }

            } else {
                this.init_empty();
            }

        }

        init_empty() {

            this.breadth = null;
            this.length = null; 
            this.area = null;
            this.hload = null;
            this.vload = null;
            this.htheta_rad = null;
            this.alpha_rad = null;
        
            this.density = null;
            this.phi_rad = null;
            this.cohesion = null;
            this.surcharge = null;
            
            this.references = this._references();
            this.limitations = this._limitations();
            this.param_descriptions = this._param_descriptions();
            this.function_descriptions = this._function_descriptions();
            this.latex = this._latex();
        
        }

        _references () {
            var dict = {
                id: 0,
                reference:"" 
             };
             dict[1] = {id: 1, reference: "Design bearing resistances calculated from EC-7 EN 1997-1:2004 Annex D"}
             
             return dict;

        }
        
        _limitations () {
            var dict = {
                id: 0,
                reference:"" 
             };
             dict[1] = {id: 1,limitation: "Ultimate limit state ONLY"}

             return dict;
        }
 
        _latex () {
            var s  = new LatexString.LatexString();
            s.documentclass('article');
            s.begin('document' );
                s.begin('table','h');
                    s.begin ('center'); 
                        s.caption('Drained Bearing Resistance (BS EN 1997 Eq D2');
                        s.label('tab:table1');
                        s.begin('tabular','l|c|r');
                            s.add ('\\textbf{Parameter} & \\textbf{Value} \\');
                            s.add ('length &' + this.length + '\\');
                            s.add ('breadth &' + this.breadth + '\\');
                            s.add ('area &' + this.area + '\\');
                           
                            s.add ('phi &' + this.phi_rad + '\\');
                            s.add ('cohesion &' + this.cohesion + '\\');
                            
                            s.add ('Nc & ' + this.nc + '\\');
                            s.add ('sc & ' + this.sc + '\\');
                            s.add ('ic & ' + this.ic+ '\\');
                            s.add ('bc & ' + this.bc + '\\');
                            s.add ('q_nc & ' + this.q_nc + '\\');
                            
                            s.add ('surcharge &' + this.surcharge + '\\');
                            s.add ('Nq & ' + this.nq + '\\');
                            s.add ('sq & ' + this.sq + '\\');
                            s.add ('iq & ' + this.iq+ '\\');
                            s.add ('bq & ' + this.bq + '\\');
                            s.add ('q_nq & ' + this.q_nq + '\\');

                            s.add ('density &' + this.density + '\\');
                            s.add ('Ng & ' + this.ng + '\\');
                            s.add ('sg & ' + this.sg + '\\');
                            s.add ('ig & ' + this.ig+ '\\');
                            s.add ('bg & ' + this.bg + '\\');
                            s.add ('q_ng & ' + this.q_ng + '\\');

                            s.add ('q_ult & ' + this.q_ult + '\\');

                        s.end('tabular');
                    s.end('center');
                s.end ('table');
            s.end('document');
            return s.toString();

        //    \documentclass{article}
        //    \begin{document}    
        //     \begin{table}[h!]  
        //       \begin{center}
        //         \caption{Your first table.}
        //         \label{tab:table1}
        //         \begin{tabular}{l|c|r} % <-- Alignments: 1st column left, 2nd middle and 3rd right, with vertical lines in between
        //           \textbf{Value 1} & \textbf{Value 2} & \textbf{Value 3}\\
        //           $\alpha$ & $\beta$ & $\gamma$ \\
        //           \hline
        //           1 & 1110.1 & a\\
        //           2 & 10.1 & b\\
        //           3 & 23.113231 & c\\
        //         \end{tabular}
        //       \end{center}
        //     \end{table}
            
        //     \end{document}' 
            
        }
        
        _param_descriptions () {
        
            var dict = {
               param:"",
               description:""
            };

            dict["length"] = {param: "length", description: "Effective length of foundation"}
            dict["breadth"] = {param: "breadth", description: "Effective breadth of foundation"}
            dict["area"] = {param: "area", description: "Effective bearing area of foundation"}
            
            dict["vload"] = {param: "vload", description: "Vertical load on foundation"}
            
            dict["hload"] = {param: "hload", description: "Horizontal load on foundation"}
            dict["htheta_rad"] = {param: "htheta_rad", description: "Angle of horizontal load in plan (from length)"}
            
            dict["cohesion"] = {param: "cohesion", description: "Drained cohesion"}
            dict["phi_rad"] = {param: "phi_rad", description: "Friction"}
                
            dict["density"] = {param: "density", description: "Effective density of soil"}
            dict["surcharge"] = {param: "surcharge", description: "Effective surcharge pressure"}
            dict["alpha_rad"] = {param:"alpha_rad", description: "Angle of inclination of base of foundation (0=horizontal)"}
            
            return dict;
        }
        
        _function_descriptions () {
            var dict = {
                func:"",
                description:"",
                limitations:"",
                reference:"",
                category:""
             };
             
             var catName = "Bearing Capacity"

            dict["calc_EC7_D2_nc"] = {func: "calc_EC7_D2_nc",description: "calculate nc factor for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_ic"] = {func: "calc_EC7_D2_ic",description: "calculate inclination of load factor ic caused by H for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_sc"] = {func: "calc_EC7_D2_sc",description: "calculate shape factor sc for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_bc"] = {func: "calc_EC7_D2_bc",description: "calculate inclined foundation factor bc for EC7 Eq D2", category: catName}
                    
            dict["calc_EC7_D2_nq"] = {func: "calc_EC7_D2_nq",description: "calculate nq factor for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_iq"] = {func: "calc_EC7_D2_iq",description: "calculate inclination of load factor iq caused by H for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_sq"] = {func: "calc_EC7_D2_sq",description: "calculate shape factor sq for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_bq"] = {func: "calc_EC7_D2_bq",description: "calculate inclined foundation factor bq for EC7 Eq D2", category: catName}
                    
            dict["calc_EC7_D2_ng"] = {func: "calc_EC7_D2_ng",description: "calculate ng factor for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_ig"] = {func: "calc_EC7_D2_ig",description: "calculate inclination of load factor ig caused by H for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_sg"] = {func: "calc_EC7_D2_sg",description: "calculate shape factor sg for EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_bg"] = {func: "calc_EC7_D2_bg",description: "calculate inclined foundation factor bg for EC7 Eq D2", category: catName}
                    
            dict["calc_EC7_D2_qnc"] = {func: "calc_EC7_D2_qnc",description: "calculate design drained bearing resistance for cohesive component qnc EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_qnq"] = {func: "calc_EC7_D2_qnq",description: "calculate design drained bearing resistance for surcharge component qnq EC7 Eq D2", category: catName}
            dict["calc_EC7_D2_qng"] = {func: "calc_EC7_D2_qng",description: "calculate design drained bearing resistance for width component qng EC7 Eq D2", category: catName}
            dict["calc_EC7_D2"] = {func: "calc_EC7_D2",description: "calculate design drained bearing resistance for EC7 Eq D2", category: catName}

             return dict;
        }


            // // 'Input variables
            // /**
            // * @param {string} dNewValue
            // */
            // set cohesion (dNewValue) {this.cohesion = parseFloat(dNewValue);}
            // set phi_rad (dNewValue) {this.phi_rad = parseFloat(dNewValue);}
            // set surcharge (dNewValue) {this.surcharge = parseFloat(dNewValue);}
            // set density (dNewValue) {this.density = parseFloat(dNewValue);}
            // set length (dNewValue) {this.length = parseFloat(dNewValue);}
            // set breadth (dNewValue) {this.breadth = parseFloat(dNewValue);}
            // set area (dNewValue) {this.area = parseFloat(dNewValue);}
            // set hload (dNewValue) {this.hload = parseFloat(dNewValue);}
            // set vload (dNewValue) {this.vload = parseFloat(dNewValue);}
            // set alpha_rad (dNewValue) {this.alpha_rad = parseFloat(dNewValue);}
            // set htheta_rad (dNewValue) {this.htheta_rad = parseFloat(dNewValue);}
            
            // // ' Output Variables
            // get sc() {return this.Sc;}
            // get nc() {return this.nc;}
            // get bc() {return this.breadthc;}
            // get ic() {return this.Ic;}
            // get sq() {return this.sq;}
            // get Nq() {return this.nq;}
            // get bq() {return this.bq;}
            // get iq() {return this.iq;}
            // get sg() {return this.sg;}
            // get Ng() {return this.ng;}
            // get bg() {return this.bg;}
            // get ig() {return this.ig;}
            // get q_nc() {return this.surcharge_nc;}
            // get q_ng() {return this.surcharge_ng;}
            // get q_nq() {return this.surcharge_nq;}
            // get q_ult() {return this.surcharge_ult}
    
    // ' Calculations for D2
    
    calc_D2_nq()    {
        this.nq = Math.exp(constPI * Math.tan(this.phi_rad)) * Math.pow(Math.tan(constPI / 4 + this.phi_rad / 2), 2);
        return this.nq;
    }
    
    calc_D2_nc()    {
        this.nc = (this.nq - 1) / Math.tan(this.phi_rad);
        return this.nc;
    }
    
    calc_D2_ng()    {
        this.ng = 2 * (this.nq - 1) * Math.tan(this.phi_rad);
        return this.ng;
    }
    
    calc_D2_bq()    {
        this.bq = Math.pow((1 - this.alpha_rad * Math.tan(this.phi_rad)), 2);
        return this.bq;
    }
    
    calc_D2_bc()    {
        this.bc = this.bq - (1 - this.bq) / (this.nc * Math.tan(this.phi_rad));
        return this.bc;
    }
    
    calc_D2_bg()    {
        this.bg = Math.pow((1 - this.alpha_rad * Math.tan(this.phi_rad)), 2);
        return this.bg;
    }
    
    calc_D2_sq()    {
        this.sq = 1 + (this.breadth/ this.length) * Math.sin(this.phi_rad);
        return this.sq;
    }
    
    calc_D2_sg()    {
        this.sg = 1 - 0.3 * (this.breadth/ this.length);
        return this.sg;
    }
    
    calc_D2_sc()    {
        this.sc = (this.sq * this.nq - 1) / (this.nq - 1);
        return this.sc;
    }
    
    calc_D2_ic()    {
        if (this.iq > 0 ) {
        this.ic = this.iq - (1 - this.iq) / (this.nc * Math.tan(this.phi_rad))
        } else {
        this.ic = 1
        }
    
        return this.ic;
    }
    
    calc_D2_iq() {
    
    this.Hmax = (this.vload + this.area * this.cohesion / Math.tan(this.phi_rad));
   
        if (this.Hmax == 0) {
        this.iq = 1;
        } else { 
            var test = 1 - this.hload / this.Hmax 
            if (test > 0) {
                this.iq = Math.pow(test,this.M);
            } else {
                this.iq = 0;
            }
        }
    
    return this.iq
    }
    
    
    calc_D2_ig()    {
    
    this.Hmax = (this.vload + this.area * this.cohesion / Math.tan(this.phi_rad));
    
    if (this.Hmax == 0) {
        this.ig = 1;
    } else {
        var test = 1 - this.hload / this.Hmax 
        if (test > 0) {
        this.ig = Math.pow(test, this.M + 1);
        } else {
        this.ig = 0;
        }
    }
    
    return this.ig;
    
    }
    
    calc_D2_m(){
        this.mb = (2 + (this.breadth/ this.length)) / (1 + (this.breadth/ this.length));
        this.ml = (2 + (this.length / this.breadth)) / (1 + (this.length / this.breadth));
        this.M = this.ml * Math.pow(Math.cos(this.htheta_rad), 2) + this.mb * Math.pow(Math.sin(this.htheta_rad),2);
        return this.M;
    }
    
    
    calc_D2_qnc()   {
    
        this.calc_D2_ng();
    
        this.calc_D2_nq();
        this.calc_D2_bq();
        this.calc_D2_sq();
        this.calc_D2_m();
        this.calc_D2_iq();
    
        this.calc_D2_nc();
        this.calc_D2_bc();
        this.calc_D2_sc();
        this.calc_D2_ic();
    
        this.q_nc = this.cohesion * this.nc * this.bc * this.sc * this.ic;
        return this.q_nc;
    }
    
    calc_D2_qnq() {
        this.calc_D2_nq();
        this.calc_D2_bq();
        this.calc_D2_sq();
        this.calc_D2_m();
        this.calc_D2_iq();
        this.q_nq = this.surcharge * this.nq * this.bq * this.sq * this.iq;
        return this.q_nq;
    }
    
    
    calc_D2_qng() {
        this.calc_D2_nq();
        this.calc_D2_ng();
        this.calc_D2_bg();
        this.calc_D2_sg();
        this.calc_D2_m();
        this.calc_D2_ig();
        this.q_ng = 0.5 * this.density * this.breadth* this.ng * this.bg * this.sg * this.ig;
        return this.q_ng;
    }
    
    calc_D2() {
        this.calc_D2_qng();
        this.calc_D2_qnq();
        this.calc_D2_qnc();
        this.q_ult = this.q_nc + this.q_nq + this.q_ng
        return this.q_ult;
    }
       
    
    }

class cEC7_UndrainedBearingResistanceD1 {
 
        constructor (data) {
       
            if (!isNullOrEmpty(data)) {
            
                if (data.breadth != undefined) this.breadth = parseFloat(data.breadth)
                if (data.length != undefined) this.length = parseFloat(data.length) 
                if (data.area != undefined) this.area = parseFloat(data.area)
                
                if (data.hload != undefined) this.hload = parseFloat(data.hload);
                if (data.alpha_rad != undefined) this.alpha_rad = parseFloat (data.alpha_rad);
                
                if (data.surcharge != undefined) this.surcharge = parseFloat (data.surcharge)
                if (data.cu != undefined)  this.cu = parseFloat (data.cu)
                
                if (data.references  != undefined) this.references = this._references();
                if (data.limitations != undefined) this.limitations = this._limitations();
                if (data.param_descriptions != undefined) this.param_descriptions = this.param_descriptions();
                if (data.function_descriptions != undefined) this.function_descriptions = this.function_descriptions();
                
                if (data.options != undefined) {
                    if ('param_descriptions' in data.options) this.param_descriptions = this._param_descriptions();
                    if ('function_descriptions' in data.options) this.param_descriptions = this._function_descriptions();
                    if ('references' in data.options) this.references = this._references();
                    if ('limitations' in data.options) this.limitations = this._limitations();
                }

            
            } else {
                this.init_empty();
            }

        }
        
        init_empty () {
            
            this.breadth = null;
            this.length = null; 
            this.area = null;
            this.hload = null;
            this.alpha_rad = null;
            this.surcharge = null;
            this.cu = null;
            this.references = this._references();
            this.limitations = this._limitations();
            this.param_descriptions = this._param_descriptions();
            this.function_descriptions =this. _function_descriptions();
            this.latex = this._latex();
        
        }

        _references () {
            var dict = {
                id: 0,
                reference:"" 
             };
             dict[1] = {id: 1, reference: "Design bearing resistances calculated from EC-7 EN 1997-1:2004 Annex D"}
             
             return dict;

        }
        
        _limitations () {
            var dict = {
                id: 0,
                reference:"" 
             };
             dict[1] = {id: 1,limitation: "Ultimate limit state ONLY"}

             return dict;
        }

        _param_descriptions () {
        
            var dict = {
               param:"",
               description:""
            };

            dict["length"] = {param: "length", description: "Effective length of foundation"}
            dict["breadth"] = {param: "breadth", description: "Effective breadth of foundation"}
            dict["area"] = {param: "area", description: "Effective bearing area of foundation"}

            dict["hload"] = {param: "hload", description: "Horizontal load on foundation"}
                     
            dict["cu"] = {param: "cu", description: "Undrained cohesion"}
            dict["surcharge"] = {param: "surcharge", description: "Effective surcharge pressure"}
            dict["alpha_rad"] = {param:"alpha_rad", description: "Angle of inclination of base of foundation (0=horizontal)"}
            
            return dict;
        }
        
        _function_descriptions () {
            var dict = {
                func:"",
                description:"",
                limitations:"",
                reference:"",
                category:""
             };
             
             var catName = "Bearing Capacity"

            dict["calc_EC7_D1_nc"]= {func: "calc_EC7_D1_nc", description: "calculate nc factor for EC7 Eq D1", category: catName}
            dict["calc_EC7_D1_ic"] = {fun: "calc_EC7_D1_ic", description: "calculate inclination of load factor caused by H for EC7 Eq D1", category: catName}
            dict["calc_EC7_D1_sc"] = {func: "calc_EC7_D1_sc",description: "calculate shape factor sc for EC7 Eq D1", category: catName}
            dict["calc_EC7_D1_bc"] = {func: "calc_EC7_D1_bc",description: "calculate inclined foundation factor for EC7 Eq D1", category: catName}
            dict["calc_EC7_D1_qnc"] = {func: "calc_EC7_D1_qnc",description: "calculate design undrained bearing resistance for cohesive component nc_q EC7 Eq D1", category: catName}
            dict["calc_EC7_D1"] = {func: "calc_EC7_D1",description: "calculate design undrained bearing resistance for EC7 Eq D1", category: catName}
                    
            return dict;
        }

        _latex () {

                


            var s  = new LatexString.LatexString();
            s.documentclass('article');
            s.begin('document');
                s.begin('table');
                    s.cr();
                    s.begin ('center'); 
                        s.caption('Undrained Bearing Resistance (BS EN 1997 Eq D1');
                        s.label('tab:table1');
                        s.begin('tabular');
                            s.brace('l|c|r');
                                s.cr();
                                s.al ('\\textbf{Parameter} & \\textbf{Value} & \\textbf{Description} \\\\');
                                s.al (`length (m) & ${this.length} & Length of foundation \\\\`);
                                s.al (`breadth (m) & ${this.breadth} & Breadth of foundation \\\\`);
                                s.al (`area (m\\textsuperscript{2}) & ${this.area} &  Effective bearing area \\\\`);
                            
                                s.al (`cohesion (kPa) & ${this.cu} & Undrained shear strength \\\\`);
                                
                                s.al (`N\\textsubscript{c} & ${this.nc} & Bearing capacity factor \\\\`);
                                s.al (`s\\textsubscript{c} & ${this.sc} & Shape factor \\\\`);
                                s.al (`i\\textsubscript{c} & ${this.ic} & Load inclination factor \\\\`);
                                s.al (`b\\textsubscript{c} & ${this.bc} & Base inclination factor \\\\`);
                                s.al (`q\\textsubscript{nc} (kPa) & ${this.q_nc} & Total undrained bearing resistance \\\\`);
                                
                                s.al (`surcharge (kPa) & ${this.surcharge} & Surcharge adjacent to foundation \\\\`);
                                s.al (`qult (kPa) & ${this.q_ult} & Total ultimate bearing resistance \\\\`);
                        s.end('tabular');
                    s.end('center');
                s.end ('table');
            s.end('document');
            return s.toString();

        //    \documentclass{article}
        //    \begin{document}    
        //     \begin{table}[h!]  
        //       \begin{center}
        //         \caption{Your first table.}
        //         \label{tab:table1}
        //         \begin{tabular}{l|c|r} % <-- Alignments: 1st column left, 2nd middle and 3rd right, with vertical lines in between
        //           \textbf{Value 1} & \textbf{Value 2} & \textbf{Value 3}\\
        //           $\alpha$ & $\beta$ & $\gamma$ \\
        //           \hline
        //           1 & 1110.1 & a\\
        //           2 & 10.1 & b\\
        //           3 & 23.113231 & c\\
        //         \end{tabular}
        //       \end{center}
        //     \end{table}
            
        //     \end{document}' 
            
        }
        // 'Input variables
        set _cu (dNewValue) {this.cu = parseFloat(dNewValue);}
        set _surcharge (dNewValue) {this.surcharge = parseFloat(dNewValue);}
        set _density (dNewValue) {this.density = parseFloat(dNewValue);}
        set _length (dNewValue) {this.length =  parseFloat(dNewValue);}
        set _breadth (dNewValue) {this.breadth=  parseFloat(dNewValue);}
        set _area (dNewValue) {this.area = parseFloat(dNewValue);}
        set _hload (dNewValue) {this.hload =  parseFloat(dNewValue);}
        set _alpha_rad (dNewValue) {this.alpha_rad = parseFloat(dNewValue);}
            
            // // ' Output Variables
            // get sc() {return this.Sc;}
            // get nc() {return this.nc;}
            // get bc() {return this.bc;}
            // get ic() {return this.Ic;}
            // get sq() {return this.sq;}
            // get Nq() {return this.nq;}
            // get bq() {return this.bq;}
            // get iq() {return this.iq;}
            // get sg() {return this.sg;}
            // get Ng() {return this.ng;}
            // get bg() {return this.bg;}
            // get ig() {return this.ig;}
            // get q_nc() {return this.surcharge_nc;}
            // get q_ng() {return this.surcharge_ng;}
            // get q_nq() {return this.surcharge_nq;}
            // get q_ult() {return this.surcharge_ult}
    
        
    // Undrained D1 Calculations
    calc_D1_nc()    {
        this.nc = constPI + 2;
        return this.nc;
    }
    
    calc_D1()   {
        this.calc_D1_qnc();
        this.q_ult= this.q_nc + this.surcharge;
        return this.q_ult;
    }
    
    calc_D1_qnc() {
        
        this.calc_D1_nc();
        this.calc_D1_bc();
        this.calc_D1_sc();
        this.calc_D1_ic();

        this.q_nc = (constPI + 2) * this.cu * this.bc * this.sc * this.ic;
        return this.q_nc
    }
    
    calc_D1_bc() {
        this.bc = 1 - 2 * this.alpha_rad / (constPI + 2);
        return this.bc;
    }
    
    calc_D1_sc() {
        this.sc = (1 + 0.2 * this.breadth/ this.length);
        return this.sc;
    }
    
    calc_D1_ic() {
        
        if (this.hload < this.area * this.cu) {
            this.ic = 0.5 * (1 + Math.pow(1 - this.hload / (this.area * this.cu), 0.5));
        } else  {
            this.ic = 0.5;
        }
        
        return this.ic;
    }
    
    }


module.exports = class mEC7_Bearing {

// "Function for Calculating Bearing Capacity in accordance with EC7 Annex D"
    
static init_functions (name  = "Geotech EC7 Bearing Resistance") {

// If Len(catName) = 0 Then catName = "Geotech EC7 Bearing Resistance"
// With ThisWorkbook
//         .IsAddin = False
// End With

// With Application
// ]
//         .MacroOptions Macro:="calc_EC7_D1_nc", Description:="calculate nc factor for EC7 Eq D1", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D1_ic", Description:="calculate inclination of load factor caused by H for EC7 Eq D1", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D1_sc", Description:="calculate shape factor sc for EC7 Eq D1", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D1_bc", Description:="calculate inclined foundation factor for EC7 Eq D1", Category:=catName
        
//         .MacroOptions Macro:="calc_EC7_D1_qnc", Description:="calculate design undrained bearing resistance for cohesive component nc_q EC7 Eq D1", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D1", Description:="calculate design undrained bearing resistance for EC7 Eq D1", Category:=catName
        
//         .MacroOptions Macro:="calc_EC7_D2_nc", Description:="calculate nc factor for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_ic", Description:="calculate inclination of load factor ic caused by H for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_sc", Description:="calculate shape factor sc for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_bc", Description:="calculate inclined foundation factor bc for EC7 Eq D2", Category:=catName
        
//         .MacroOptions Macro:="calc_EC7_D2_nq", Description:="calculate nq factor for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_iq", Description:="calculate inclination of load factor iq caused by H for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_sq", Description:="calculate shape factor sq for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_bq", Description:="calculate inclined foundation factor bq for EC7 Eq D2", Category:=catName
        
//         .MacroOptions Macro:="calc_EC7_D2_ng", Description:="calculate ng factor for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_ig", Description:="calculate inclination of load factor ig caused by H for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_sg", Description:="calculate shape factor sg for EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_bg", Description:="calculate inclined foundation factor bg for EC7 Eq D2", Category:=catName
        
//         .MacroOptions Macro:="calc_EC7_D2_qnc", Description:="calculate design drained bearing resistance for cohesive component qnc EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_qnq", Description:="calculate design drained bearing resistance for surcharge component qnq EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2_qng", Description:="calculate design drained bearing resistance for width component qng EC7 Eq D2", Category:=catName
//         .MacroOptions Macro:="calc_EC7_D2", Description:="calculate design drained bearing resistance for EC7 Eq D2", Category:=catName





// End With

//  With ThisWorkbook
//         .IsAddin = True
//  End With

}

static calc_EC7 (data) {

    var result = [];
    result.push(this.calc_EC7_D1(data))
    result.push(this.calc_EC7_D2(data))
    return result;
}

static calc_EC7_D1_nc() {
        
        // Attribute calc_EC7_D1_nc.VB_Description = "calculate nc factor for EC7 Eq D1"
        // Attribute calc_EC7_D1_nc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_UndrainedBearingResistanceD1();
        return ec7.calc_D1_nc();
}

// /**
//  * 
//  * @param {object} data 
//  * @returns {number}
//  */

static calc_EC7_D1_ic_data (data) {

        /// Attribute calc_EC7_D1_ic.VB_Description = "calculate inclination of load factor caused by H for EC7 Eq D1"
        // Attribute calc_EC7_D1_ic.VB_ProcData.VB_Invoke_Func = " \n21"
        var arr_data = [];
        var result = [];

        if (Array.isArray (data)) {
            arr_data = data;
        } else {
           // var obj = JSON.parse(data);
            arr_data = this.split_to_D1_data (data);
        }
        var count = arr_data.length;
        for (var i = 0; i < count; i++) {
                var ec7 = new cEC7_UndrainedBearingResistanceD1(arr_data[i]);
                ec7.calc_D1_ic();
                result[i] = ec7
        }
            
        return result;
 
}

// /**
//  * 
//  * @param {number} area
//  * @param {number} cu 
//  * @param {number} hload 
//  * @returns {number}
//  */
static split_to_D1_data (data) {
        var res = []
        
        var a_length = []
        var a_breadth = []
        var a_area = []
        var a_cu = []
        var a_hload = []
        var a_alpha_rad = []
        var a_surcharge = []

        if (data.length !== undefined)  a_length = data.length.toString().toString().split(",");
        if (data.breadth !== undefined)  a_breadth = data.breadth.toString().toString().split(",");
        if (data.area !== undefined)  a_area = data.area.toString().toString().split(",");
        if (data.cu !== undefined) a_cu = data.cu.toString().toString().split(",");
        if (data.hload !== undefined) a_hload = data.hload.toString().toString().split(",");
        if (data.alpha_rad !== undefined) a_alpha_rad = data.alpha_rad.toString().toString().split(",");
        if (data.surcharge !== undefined) a_surcharge = data.surcharge.toString().toString().split(",");
       
        var count = Math.max(a_length.length,a_breadth.length,a_area.length,
            a_cu.length,a_hload.length,a_alpha_rad.length, a_surcharge.length);
        
        for (var i = 0; i < count; i++) {
            var obj = new Object();
            if (a_length.length>0) { if (a_length.length==1) {obj.length = a_length[0]} else {obj.length = a_length[i]}}
            if (a_breadth.length>0)  { if (a_breadth.length==1) {obj.breadth = a_breadth[0]} else {obj.breadth = a_breadth[i]}}
            if (a_area.length>0)  { if (a_area.length==1) {obj.area = a_area[0]} else {obj.area = a_area[i]}}
            if (a_cu.length>0)  { if (a_cu.length==1) {obj.cu = a_cu[0]} else {obj.cu = a_cu[i]}}
            if (a_hload.length>0)  { if (a_hload.length==1) {obj.hload = a_hload[0]} else {obj.hload = a_hload[i]}}
            if (a_alpha_rad.length>0)  { if (a_alpha_rad.length==1) {obj.alpha_rad = a_alpha_rad[0]} else {obj.alpha_rad = a_alpha_rad[i]}}
            if (a_surcharge.length>0)  { if (a_surcharge.length==1) {obj.surcharge = a_surcharge[0]} else {obj.surcharge = a_surcharge[i]}}
         
            res.push(obj)
        }

        return res;

}

static calc_EC7_D1_ic(area, cu, hload) {

        // Attribute calc_EC7_D1_ic.VB_Description = "calculate inclination of load factor caused by H for EC7 Eq D1"
        // Attribute calc_EC7_D1_ic.VB_ProcData.VB_Invoke_Func = " \n21"
        
        var ec7 = new cEC7_UndrainedBearingResistanceD1();
        ec7.area = area
        ec7.cu = cu
        ec7.hload = hload
        return ec7.calc_D1_ic();
       
}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @returns {number}
 */
static calc_EC7_D1_sc(breadth, length) {

        // Attribute calc_EC7_D1_sc.VB_Description = "calculate shape factor sc for EC7 Eq D1"
        // Attribute calc_EC7_D1_sc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_UndrainedBearingResistanceD1();
        ec7.length = length
        ec7.breadth = breadth
        return ec7.calc_D1_sc();
}

/**
 * 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D1_bc(alpha_rad) {
        
        // Attribute calc_EC7_D1_bc.VB_Description = "calculate inclined foundation factor for EC7 Eq D1"
        // Attribute calc_EC7_D1_bc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_UndrainedBearingResistanceD1();
        ec7.alpha_rad = alpha_rad
        return ec7.calc_D1_bc();

}

// https://stackoverflow.com/questions/10855908/how-to-overload-functions-in-javascript
// data: function(key, value) {
//     if (arguments.length === 0) {
//         // .data()
//         // no args passed, return all keys/values in an object
//     } else if (typeof key === "string") {
//         // first arg is a string, look at type of second arg
//         if (typeof value !== "undefined") {
//             // .data("key", value)
//             // set the value for a particular key
//         } else {
//             // .data("key")
//             // retrieve a value for a key
//         }
//     } else if (typeof key === "object") {
//         // .data(object)
//         // set all key/value pairs from this object
//     } else {
//         // unsupported arguments passed
//     }
// }

static calc_EC7_D1_data (data, funct = 'q_ult', callback) { 
    
    var a_res = []
    var a_data = []

    try {
        if (Array.isArray(data)) {
            // its already an array
        a_data = data;
        } else {
            // try spliting the data
            var test = this.split_to_D1_data(data)
            if (test.length > 0) {
                a_data = test;
            } else {
                // try assigning as single data;
                a_data[0] = data;
            }
        }
        
        for (var i = 0; i < a_data.length; i++) {
                var ec7 = new cEC7_UndrainedBearingResistanceD1(a_data[i]);
                if (funct=='q_ult') ec7.calc_D1();
                if (funct=='ic') ec7.calc_D1_ic();
                if (funct=='sc') ec7.calc_D1_sc();
                if (funct=='bc') ec7.calc_D1_bc();
                if (funct=='q_nc') ec7.calc_D1_qnc();
                if (funct=='nc') ec7.calc_D1_nc();
                if (data.latex != undefined) {
                    ec7.latex = ec7._latex();
                }
                a_res.push (ec7);
        }
        
        if (callback) {
                callback (null, a_res)
        } else {
            return a_res
        }

    } catch (err) {
        if (callback) {
                callback (err, a_res)
        } else {
            return err;
        }
    }

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cu 
 * @param {number} surcharge 
 * @param {number} hload 
 * @param {number} alpha_rad 
 * @param {string} [resp] - 'value'
 * @returns {}
 */
static calc_EC7_D1 (breadth, length, area, cu, surcharge, hload, alpha_rad, options) {

        // Attribute calc_EC7_D1.VB_Description = "calculate design undrained bearing resistance for EC7 Eq D1"
        // Attribute calc_EC7_D1.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_UndrainedBearingResistanceD1();
        
        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.cu = cu
        ec7.surcharge = surcharge

        ec7.hload = hload
        ec7.alpha_rad = alpha_rad
        
        if ('latex' in options) {
            ec7.latex = ec7._latex();
        }

        if ('value' in options) {
            return ec7.calc_D1();
        }
        
        return ec7;

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cu 
 * @param {number} hload 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D1_qnc(breadth, length, area, cu, hload, alpha_rad ) {

        // Attribute calc_EC7_D1_qnc.VB_Description = "calculate design undrained bearing resistance for cohesive component nc_q EC7 Eq D1"
        // Attribute calc_EC7_D1_qnc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_UndrainedBearingResistanceD1();

        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area

        ec7.cu = cu
        
        ec7.hload = hload
        ec7.alpha_rad = alpha_rad
        
        return ec7.calc_D1_qnc();
}

static split_to_D2_data (data) {

    var res = []
    
    var a_length = []
    var a_breadth = []
    var a_area = []
    
    var a_c = []
    var a_phi_rad = []
    
    var a_hload = []
    var a_vload = []
    var a_htheta_rad = [] 
   
    var a_alpha_rad = []
    var a_density = []
    var a_surcharge = []


    if (data.length !== undefined)  a_length = data.length.toString().split(",");
    if (data.breadth !== undefined)  a_breadth = data.breadth.toString().split(",");
    if (data.area !== undefined)  a_area = data.area.toString().split(",");
    if (data.c !== undefined) a_c = data.c.toString().split(",");
    if (data.phi_rad !== undefined) a_phi_rad = data.phi_rad.toString().split(",");
    if (data.hload !== undefined) a_hload = data.hload.toString().split(",");
    if (data.vload !== undefined) a_vload = data.vload.toString().split(",");
    if (data.htheta_rad !== undefined) a_htheta_rad = data.htheta_rad.toString().split(",");
    if (data.alpha_rad !== undefined) a_alpha_rad = data.alpha_rad.toString().split(",");
    if (data.density !== undefined) a_density = data.density.toString().split(",");
    if (data.surcharge !== undefined) a_surcharge = data.surcharge.toString().split(",");

    var count = Math.max(a_length.length,a_breadth.length,a_area.length,
                         a_c.length,a_phi_rad.length,
                         a_hload.length,a_vload.length,a_htheta_rad.length,
                         a_alpha_rad.length,a_density.length, a_surcharge.length);
    
    for (var i = 0; i < count; i++) {
        var obj = new Object();
        if (a_length.length>0) { if (a_length.length==1) {obj.length = a_length[0]} else {obj.length = a_length[i]}}
        if (a_breadth.length>0)  { if (a_breadth.length==1) {obj.breadth = a_breadth[0]} else {obj.breadth = a_breadth[i]}}
        if (a_area.length>0)  { if (a_area.length==1) {obj.area = a_area[0]} else {obj.area = a_area[i]}}
        if (a_c.length>0)  { if (a_c.length==1) {obj.c = a_c[0]} else {obj.c = a_c[i]}}
        if (a_phi_rad.length>0)  { if (a_phi_rad.length==1) {obj.phi_rad = a_phi_rad[0]} else {obj.phi_rad = a_phi_rad[i]}}
        if (a_hload.length>0)  { if (a_hload.length==1) {obj.hload = a_hload[0]} else {obj.hload = a_hload[i]}}
        if (a_htheta_rad.length>0)  { if (a_htheta_rad.length==1) {obj.htheta_rad = a_htheta_rad[0]} else {obj.htheta_rad = a_htheta_rad[i]}}
        if (a_vload.length>0)  { if (a_vload.length==1) {obj.vload = a_vload[0]} else {obj.vload = a_vload[i]}}
        if (a_alpha_rad.length>0)  { if (a_alpha_rad.length==1) {obj.alpha_rad = a_alpha_rad[0]} else {obj.alpha_rad = a_alpha_rad[i]}}
        if (a_density.length>0)  { if (a_density.length==1) {obj.density = a_density[0]} else {obj.density = a_density[i]}}
        if (a_surcharge.length>0)  { if (a_surcharge.length==1) {obj.surcharge = a_surcharge[0]} else {obj.surcharge = a_surcharge[i]}}
        res.push(obj)
    }

    return res;

}
/**
 * 
 * @param {number} phi_rad 
 * @returns {number}
 */

static calc_EC7_D2_nc(phi_rad ) {
        // Attribute calc_EC7_D2_nc.VB_Description = "calculate nc factor for EC7 Eq D2"
        // Attribute calc_EC7_D2_nc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        ec7.calc_D2_nq
        return ec7.calc_D2_nc();
}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} vload 
 * @param {number} hload 
 * @param {number} htheta_rad 
 * @returns {number}
 */
static calc_EC7_D2_ic(breadth, length, area, cohesion,  phi_rad, vload, hload, htheta_rad ) {
        // Attribute calc_EC7_D2_ic.VB_Description = "calculate inclination of load factor ic caused by H for EC7 Eq D2"
        // Attribute calc_EC7_D2_ic.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
          
        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.phi_rad = phi_rad
        ec7.cohesion = cohesion
       
        ec7.vload= vload 
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad
             
        ec7.calc_D2_nq
        ec7.calc_D2_nc
        ec7.calc_D2_m
        ec7.calc_D2_iq

        return ec7.calc_D2_ic();

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} phi_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_sc(breadth, length, phi_rad, alpha_rad) {
        
        // Attribute calc_EC7_D2_sc.VB_Description = "calculate shape factor sc for EC7 Eq D2"
        // Attribute calc_EC7_D2_sc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        
        ec7.breadth = breadth;
        ec7.length = length;

        ec7.phi_rad = phi_rad;
        
        ec7.alpha_rad = alpha_rad;
       
       
        ec7.calc_D2_nq();
        ec7.calc_D2_sq();

        return ec7.calc_D2_sc();

}
/**
 * 
 * @param {number} phi_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_bc(phi_rad, alpha_rad ) {

        // Attribute calc_EC7_D2_bc.VB_Description = "calculate inclined foundation factor bc for EC7 Eq D2"
        // Attribute calc_EC7_D2_bc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        ec7.alpha_rad = alpha_rad
        ec7.calc_D2_nq();
        ec7.calc_D2_nc();
        ec7.calc_D2_bq();
        return ec7.calc_D2_bc();
}
/**
 * 
 * @param {number} phi_rad 
 * @returns {number}
 */
static calc_EC7_D2_nq(phi_rad ) {

        // Attribute calc_EC7_D2_nq.VB_Description = "calculate nq factor for EC7 Eq D2"
        // Attribute calc_EC7_D2_nq.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        return ec7.calc_D2_nq();
}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} Hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @returns {number}
 */
static calc_EC7_D2_iq(breadth, length, area, cohesion, phi_rad, Hload, vload, htheta_rad ) {

        // Attribute calc_EC7_D2_iq.VB_Description = "calculate inclination of load factor iq caused by H for EC7 Eq D2"
        // Attribute calc_EC7_D2_iq.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();

        ec7.length = length
        ec7.breadth = breadth
        ec7.area = area
           
        ec7.cohesion = cohesion 
        ec7.phi_rad = phi_rad

        ec7.hload = Hload
        ec7.vload = vload
        ec7.htheta_rad = htheta_rad
      
        ec7.calc_D2_m
        return ec7.calc_D2_iq();
}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} phi_rad 
 * @returns {number}
 */
static calc_EC7_D2_sq( breadth, length, phi_rad) {

        // Attribute calc_EC7_D2_sq.VB_Description = "calculate shape factor sq for EC7 Eq D2"
        // Attribute calc_EC7_D2_sq.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
      
        ec7.breadth = breadth
        ec7.length = length
        ec7.phi_rad = phi_rad
        
        return ec7.calc_D2_sq();
}
/**
 * 
 * @param {number} phi_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_bq(phi_rad, alpha_rad ) {

        // Attribute calc_EC7_D2_bq.VB_Description = "calculate inclined foundation factor bq for EC7 Eq D2"
        // Attribute calc_EC7_D2_bq.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        ec7.alpha_rad = alpha_rad
        return ec7.calc_D2_bq();
}

/**
 * 
 * @param {number} phi_rad 
 * @returns {number}
 */
static calc_EC7_D2_ng(phi_rad ) {

        // Attribute calc_EC7_D2_ng.VB_Description = "calculate ng factor for EC7 Eq D2"
        // Attribute calc_EC7_D2_ng.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        ec7.calc_D2_nq
        return ec7.calc_D2_ng();

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @returns {number}
 */
static calc_EC7_D2_ig(breadth, length, area, cohesion, phi_rad, hload, vload, htheta_rad ) {

        // Attribute calc_EC7_D2_ig.VB_Description = "calculate inclination of load factor ig caused by H for EC7 Eq D2"
        // Attribute calc_EC7_D2_ig.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
       
        ec7.length = length
        ec7.breadth = breadth
        ec7.area = area
          
        ec7.cohesion = cohesion
        ec7.phi_rad = phi_rad

        ec7.vload = vload
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad
       
        ec7.calc_D2_m
        return ec7.calc_D2_ig();

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @returns {number}
 */
static calc_EC7_D2_sg(breadth, length ) {

        // Attribute calc_EC7_D2_sg.VB_Description = "calculate shape factor sg for EC7 Eq D2"
        // Attribute calc_EC7_D2_sg.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.breadth = breadth
        ec7.length = length
        return ec7.calc_D2_sg();
}
/**
 * 
 * @param {number} phi_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_bg(phi_rad, alpha_rad ) {

        // Attribute calc_EC7_D2_bg.VB_Description = "calculate inclined foundation factor bg for EC7 Eq D2"
        // Attribute calc_EC7_D2_bg.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.phi_rad = phi_rad
        ec7.alpha_rad = alpha_rad
        return ec7.calc_D2_bg();

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_qnc(breadth, length, area, cohesion, phi_rad, hload, vload, htheta_rad, alpha_rad ) {

        // Attribute calc_EC7_D2_qnc.VB_Description = "calculate design drained bearing resistance for cohesive component qnc EC7 Eq D2"
        // Attribute calc_EC7_D2_qnc.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.cohesion = cohesion
        ec7.phi_rad = phi_rad
      
        ec7.vload = vload
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad

        ec7.alpha_rad = alpha_rad

        return  ec7.calc_D2_qnc();
}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} surcharge 
 * @param {number} hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_qnq(breadth, length, area, cohesion, phi_rad, surcharge, hload, vload, htheta_rad, alpha_rad) {

        // Attribute calc_EC7_D2_qnq.VB_Description = "calculate design drained bearing resistance for surcharge component qnq EC7 Eq D2"
        // Attribute calc_EC7_D2_qnq.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        
        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.cohesion = cohesion
        ec7.phi_rad = phi_rad
        ec7.surcharge = surcharge
        
        ec7.vload = vload
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad
        
        ec7.alpha_rad = alpha_rad
       
        
        return ec7.calc_D2_qnq();

}
/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} density 
 * @param {number} hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @param {number} alpha_rad 
 * @returns {number}
 */
static calc_EC7_D2_qng(breadth, length, area, cohesion, phi_rad, density, hload, vload, htheta_rad, alpha_rad) {
        
        // Attribute calc_EC7_D2_qng.VB_Description = "calculate design drained bearing resistance for width component qng EC7 Eq D2"
        // Attribute calc_EC7_D2_qng.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();
        
        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.cohesion = cohesion
        ec7.phi_rad = phi_rad
        ec7.density = density
        
        ec7.vload = vload
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad
        
        ec7.alpha_rad = alpha_rad
           
        return ec7.calc_D2_qng();

}
static calc_EC7_D2_data (data, funct = 'q_ult') { 
    
    var a_res = []
    var a_data = []

    if (Array.isArray(data)) {
        //its already an array, assume it's  D2 fields
       a_data = data;
    } else {
        // try splitting the data into D2 fields
        var test = this.split_to_D2_data(data)
        if (test.count > 0) {
            a_data = test;
        } else {
            // try assigning as single D2 data;
            a_data[0] = data;
        }
    }

   
    for (var i = 0; i < a_data.length; i++) {
            
        var ec7 = new cEC7_DrainedBearingResistanceD2(a_data[i]);

        if (funct=='q_ult') ec7.calc_D2(); 
        
        if (funct=='nc') ec7.calc_D2_nc();
        if (funct=='ic') ec7.calc_D2_ic();
        if (funct=='sc') ec7.calc_D2_sc();
        if (funct=='bc') ec7.calc_D2_bc();
        if (funct=='q_nc') ec7.calc_D2_qnc();

        if (funct=='nq') ec7.calc_D2_nq();
        if (funct=='iq') ec7.calc_D2_iq();
        if (funct=='sq') ec7.calc_D2_sq();
        if (funct=='bq') ec7.calc_D2_bq();
        if (funct=='q_nq') ec7.calc_D2_qnq();
        
        if (funct=='ng') ec7.calc_D2_ng();
        if (funct=='ig') ec7.calc_D2_ig();
        if (funct=='sg') ec7.calc_D2_sg();
        if (funct=='bg') ec7.calc_D2_bg();
        if (funct=='q_ng') ec7.calc_D2_qng();
        
        a_res.push (ec7);
    } 
    
    return a_res;

}


/**
 * 
 * @param {number} breadth 
 * @param {number} length 
 * @param {number} area 
 * @param {number} cohesion 
 * @param {number} phi_rad 
 * @param {number} surcharge 
 * @param {number} density 
 * @param {number} hload 
 * @param {number} vload 
 * @param {number} htheta_rad 
 * @param {number} alpha_rad 
 * @param {string} [resp] - value
 * @returns {}
 */
static calc_EC7_D2(breadth, length, area, cohesion, phi_rad, surcharge, density, hload, vload, htheta_rad, alpha_rad, options ) {

        // Attribute calc_EC7_D2.VB_Description = "calculate design drained bearing resistance for EC7 Eq D2"
        // Attribute calc_EC7_D2.VB_ProcData.VB_Invoke_Func = " \n21"

        var ec7 = new cEC7_DrainedBearingResistanceD2();

        ec7.breadth = breadth
        ec7.length = length
        ec7.area = area
        
        ec7.cohesion = cohesion
        ec7.phi_rad = phi_rad
        ec7.density = density
        ec7.surcharge = surcharge
       
        ec7.vload = vload
        ec7.hload = hload
        ec7.htheta_rad = htheta_rad
        
        ec7.alpha_rad = alpha_rad
        
        if ('latex' in options) {
            ec7.latex = ec7._latex();
        }
        if ('value' in options) {
        return ec7.calc_D2();
        }

        return ec7;


}

}


