const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
var CryptoJS = require("crypto-js");
app.use(bodyParser.json());
app.use(express.static("public"));
const port = process.env.PORT || 8771;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const File = require("./files");
const User = require("./user");
const Exam = require("./exam");
const Student = require("./student");
const fs = require("fs");
const path = require("path");
const uri =
  "mongodb+srv://web1234:web1234@clusternewz.o2wezdx.mongodb.net/StudentManagement?retryWrites=true&w=majority";
const mongoose = require("mongoose");
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");

    const db = mongoose.connection;
    // const collection = db.collection('drydatas');
    db.on("error", function (err) {
      console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });

async function encrypt(str) {
  var ciphertext = CryptoJS.AES.encrypt(str, "secretthavells").toString();
  // console.log(ciphertext)
  return ciphertext;
}

async function decrypt(str) {
  var bytes = CryptoJS.AES.decrypt(str, "secretthavells");
  console.log(bytes);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
  console.log(originalText);
}
app.post("/signup", async (req, res) => {
  const item = await User.find({
    name: req.body.UserName,
    password:  req.body.Password,
  });
  console.log(item);

  try {
    if (item.length == 0) {
      res.send({ status: 0, data: "No user" });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    res.send({ status: 2, data: err });
    console.log(err);
  }
});

app.post("/signupstu", async (req, res) => {
  const item = await Student.find({
    student_email: req.body.UserName,
   
  });
  console.log(item);

  try {
    if (item.length == 0) {

    
        res.send({ status: 0, data: "No user" });
    } else {
      let str=await decrypt(item[0].student_password)
      console.log(str)
      console.log(req.body.Password)
     

      if(str==req.body.Password){
        res.send({
          status: 200,
          data: {
            val: item[0].isactive,
            id: item[0].student_id,
            name: item[0].student_name,
            role: "stu",
          },
        });
      }
      else{
        res.send({status:0})

      }

    }
  } catch (err) {
    res.send({ status: 2, data: err });
    console.log(err);
  }
});

async function generateRandom6DigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post("/addexam", async (req, res) => {
  console.log(req.body);
  const newItem = new Exam({
    exam_id: await generateRandom6DigitNumber(),
    exam_name: req.body.examname,
    exam_date: req.body.examdate,
    exam_max: req.body.exammax,
    exam_min: req.body.exammin,
    isactive: true,
  });
  const item = await newItem.save();
  try {
    res.send({ status: 200, data: item });
    console.log("Done");
  } catch (err) {
    res.send({ status: 2, data: err });
    console.log(err);
  }
});
app.post("/checkexist", async (req, res) => {
  try {
    const item = await Exam.find({
      exam_name: { $regex: new RegExp(`^${req.body.examname}$`, "i") },
    });
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ data: err, status: 2 });
  }
});

app.post("/getstudentfilter", async (req, res) => {
  console.log(req.body.val);
  try {
    const item = await Student.find({
      $or: [
        { student_name: { $regex: new RegExp(`${req.body.val}`, "i") } },
        { student_email: { $regex: new RegExp(`${req.body.val}`, "i") } },
        { student_gender: { $regex: new RegExp(`^${req.body.val}$`, "i") } },
        { student_usn: { $regex: new RegExp(`${req.body.val}`, "i") } },
      ],
    });
    console.log(item);
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ data: err, status: 2 });
  }
});

app.post("/checkstuexistmail", async (req, res) => {
  try {
    const item = await Student.find({
      student_email: { $regex: new RegExp(`^${req.body.student_email}$`, "i") },
    });
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ data: err, status: 2 });
  }
});

app.post("/checkstuexistusn", async (req, res) => {
  try {
    const item = await Student.find({
      student_usn: { $regex: new RegExp(`^${req.body.student_usn}$`, "i") },
    });
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ data: err, status: 2 });
  }
});

app.get("/getexam", async (req, res) => {
  try {
    const item = await Exam.find();
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 99, itm: err });
  }
});

async function generateString(name, dateStr, usn) {
  const dateComponents = dateStr.split("-");
  const year = dateComponents[0].slice(-2);
  const month = dateComponents[1];
  const day = dateComponents[2];
  const firstThreeLettersOfName = name.slice(0, 3);
  const lastTwoDigitsOfUSN = usn.slice(-2);

  const resultString = `${firstThreeLettersOfName}${year}${month}${day}${lastTwoDigitsOfUSN}`;

  return encrypt(resultString);
}

async function mail(to, sub, body) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "webdearsproject@gmail.com",
      pass: "iefrtrdbsudvpsyx",
    },
  });

  var mailoptions = {
    from: "webdearsproject@gmail.com",
    to: to,
    subject: sub,
    html: body,
  };

  transporter.sendMail(mailoptions, function (err, info) {
    if (err) {
      return err;
    } else {
      console.log(err);
      return true;
    }
  });
}
app.post("/addstudent", async (req, res) => {
  const newItem = new Student({
    student_id: await generateRandom6DigitNumber(),
    student_name: req.body.student_name,
    student_password: await generateString(
      req.body.student_name,
      req.body.student_dob,
      req.body.student_usn
    ),
    student_email: req.body.student_email,
    student_usn: req.body.student_usn,
    student_dob: req.body.student_dob,
    student_gender: req.body.student_gender,
    student_exams: req.body.student_exams,
    isactive: true,
  });
  const item = await newItem.save();
  try {
    let body = ` <p>Hello ${req.body.student_name},</p>
  
      <p>Your student account has been created by the admin. You can now log in to check your marks and performance.</p>
    
      <p><strong>Login Credentials:</strong></p>
      <ul>
        <li><strong>Username:</strong> ${req.body.student_email}</li>
        <li><strong>Password:</strong> ***********</li>
      </ul>
    
      <p>Your password is created using the following format:</p>
      <p>[First Three Letters of Your Name][DOB (YYMMDD)][Last Two Characters of Your USN]</p>
    
      <p>Example: If your details are:</p>
      <ul>
        <li><strong>Student Name:</strong> Mansoor</li>
        <li><strong>Student USN:</strong> 1dt20cs075</li>
        <li><strong>Student DOB:</strong> 2024-01-03</li>
      </ul>
    
      <p>Then your password will be "man24010375".</p>
    
      <p>Please use these credentials to log in and explore your student account.</p>
    
      <p>Best regards,<br>Admin</p>`;
    let result = await mail(
      req.body.student_email,
      "Student Account Created",
      body
    );

    res.send({ status: 200, data: item });
    console.log("Done");
  } catch (err) {
    res.send({ status: 2, data: err });
    console.log(err);
  }
});

app.get("/getstudentall", async (req, res) => {
  try {
    const item = await Student.find();
    if (item.length == 0) {
      res.send({ status: 0, data: item });
    } else {
      res.send({ status: 200, data: item });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 99, itm: err });
  }
});

app.post("/activate", async (req, res) => {
  const filter = { student_id: req.body.stu_id };
  const update = { isactive: req.body.stu_status };
  const options = { new: true }; 
  const updatedItem = await Student.findOneAndUpdate(filter, update, options);
  if (!updatedItem) {
    res.send({ status: 0, data: "error" });
  } else {
    console.log(updatedItem);
    res.send({ data: updatedItem, status: 200 });
  }
});

app.post("/updatestudent", async (req, res) => {
  const filter = { student_id: req.body.stu_id };
  const update = {
    student_name: req.body.student_name,
    student_usn: req.body.student_usn,
    student_dob: req.body.student_dob,
    student_gender: req.body.student_gender,
    student_exams: req.body.student_exams,
  };
  const options = { new: true }; // Return the updated document
  const updatedItem = await Student.findOneAndUpdate(filter, update, options);
  if (!updatedItem) {
    res.send({ status: 0, data: "error" });
  } else {
    res.send({ status: 200, data: updatedItem });
  }
});

app.post("/getstudent", async (req, res) => {
  let item = await Student.findOne({
    student_id: req.body.id,
  });
  if (!item) {
    res.send({ status: 0, data: "error" });
  } else {
    console.log(item);
    res.send({ data: item, status: 200 });
  }
});

app.post("/getstudentexam", async (req, res) => {
  let item = await Student.findOne({
    student_id: req.body.id,
  });
  let item2 = await Exam.find({});
  let item3 = await Student.find({});
  if (!item) {
    res.send({ status: 0, data: "error" });
  } else {
    console.log(item);
    res.send({ data1: item, dat2: item2, status: 200, data3: item3 });
  }
});

app.get("/getdashboarddata", async (req, res) => {
  let item2 = await Exam.find({});
  let item3 = await Student.find({});
  if (!item2 || !item3) {
    res.send({ status: 0, data: "error" });
  } else {
    res.send({ data1: item2, status: 200, data2: item3 });
  }
});

app.listen(port, () => {
  console.log("Server started on post " + port);
});
