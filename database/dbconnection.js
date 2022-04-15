exports.dbConnection = function () {
    var dbConfig = {
        user: "sa", // SQL Server Login
        password: "thecodehubs", // SQL Server Password
        server: "DESKTOP-78L71550", // SQL Server Server name
        database: "latex2PDF_task" // SQL Server Database name
    };
    return dbConfig;
};