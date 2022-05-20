var sqlite3 = require('sqlite3').verbose()
// var md5 = require('md5')

const DBSOURCE = "database/db.sqlite"
// SQLlite does not have a uniqueidentifier data type
// https://www.sqlite.org/datatype3.html
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE ge_task (
                    Id TEXT PRIMARY KEY,
                    owner TEXT NOT NULL,
                    created INT NOT NULL,
                    folder TEXT NULL,
                    files TEXT NULL, 
                    type TEXT NULL,
                    expires INT NOT NULL,
                    dataclass NULL,
                    options TEXT NULL);`,
        (err) => {
                if (err) {
                    console.error(err.message)
                } 
        });
        
        db.run(`alter table ge_task add column description TEXT;`,
        (err) => {
            if (err) {
               console.error(err.message)
            } 
        });
    }
});


module.exports = db



