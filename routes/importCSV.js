const router = require("express").Router();
const path = require('path')

const multer = require('multer');
const fs=require('fs');

const csv = require('fast-csv');
const {db_student}=require("../config/db");
const auth = require("../middleware/auth");


//multer config
let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './routes/uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
let upload = multer({
    storage: storage
});


//import CSV File
router.post('/import-csv', auth,upload.single("file"), (req, res) =>{
    console.log(req.file.path)
    uploadCsv(__dirname + '/uploads/' + req.file.filename);
    res.send("CSV File imported")
});


function uploadCsv(uriFile){
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    let fileStream = csv
        .parse()
        .on("data", function (data) {
            csvDataColl.push(data);
        })
        .on("end", function () {
            csvDataColl.shift();
            
            for(let i=0;i<csvDataColl.length;i++)
            {
                let name1=csvDataColl[i][0];
                let roll_no1=csvDataColl[i][1];
                let address1=csvDataColl[i][2];
               let institute1=csvDataColl[i][3];
               let course1=csvDataColl[i][4];
               let email1=csvDataColl[i][5];
          
               //query for not uploading duplicate rows
            let q = `INSERT INTO students (Name,Roll_No,Address,Institute,Course,Email) SELECT  "${name1}","${roll_no1}","${address1}","${institute1}","${course1}","${email1}" WHERE NOT EXISTS (SELECT * FROM students WHERE Name="${name1}" AND Roll_No="${roll_no1}" AND Address="${address1}" AND Institute="${institute1}" AND Course="${course1}" AND Email="${email1}")` ;
            
                
                    db_student.query(q, [csvDataColl], (error, res) => {
                        console.log(error || res);
                    });
                
            }

            fs.unlinkSync(uriFile)
            
        });
  
    stream.pipe(fileStream);
}


module.exports = router