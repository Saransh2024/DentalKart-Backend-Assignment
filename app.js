const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mysql = require('mysql');
const bodyparser = require('body-parser')
const {db_student} = require("./config/db.js");
const app= express()
const PORT = process.env.PORT || 3000

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

app.use(express.json());


//Routes
app.use("/api", require("./routes/auth"));
app.use("/", require("./routes/importCSV"));
app.use("/",require("./routes/exportCSV"));

//List of students to be visible on frontend
app.get('/', (req, res) => {
 
  const q = "SELECT * FROM students";
    
  db_student.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    
    var sql_data=JSON.parse(JSON.stringify(data));
  res.send(sql_data);
  });
});

app.listen(PORT,()=>{
  console.log(`Server listening at port ${PORT}`);
})
