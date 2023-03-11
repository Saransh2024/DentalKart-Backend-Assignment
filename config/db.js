const mysql= require('mysql');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Saransh@12345",
    database:"users"

});

const db_student = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Saransh@12345",
    database: "sample"
})
module.exports = {db,db_student} 