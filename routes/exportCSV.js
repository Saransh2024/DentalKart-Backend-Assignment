const express = require('express');
const router = express.Router();
const {db_student} = require('../config/db.js');
const data_exporter = require('json2csv').Parser;
const auth = require("../middleware/auth");




// export CSV
router.get('/export-csv',auth, (req, res, next)=>{

    db_student.query('SELECT * FROM students', (error, data)=>{

        let mysql_data = JSON.parse(JSON.stringify(data));

        //convert JSON to CSV Data

        let file_header = ['Name', 'Roll_No', 'Address', 'Institute', 'Course', 'Email'];

        let json_data = new data_exporter({file_header});

        let csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");

        res.setHeader("Content-Disposition", "attachment; filename=sample-data.csv");

        res.status(200).end(csv_data);

    });

});

module.exports = router;
