require("dotenv").config();

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const formData = require("express-form-data");

const app = express();
app.use(formData.parse());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AWS = require("aws-sdk");
const { FSx } = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: "eu-west-3",
});
// (async () => {

// s3.listBuckets((err, res) => {
//     console.log(res.Buckets);
// });
// const params = {
//     Bucket: process.env.BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "eu-west-3"
//     }
// };

// s3.createBucket(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });
// })();

const port = 8080 || process.env.PORT;
app.get("/message", (req, res) => {
  res.send(process.env.MESSAGE || "HELLO WORLD");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

app.post("/upload", (req, res) => {
  //   const fileContent = fs.readFileSync(fileName);
  const file = req.files.file;
  if (!file) {
    return res.sendStatus(400);
  }
  console.log(file.path);
  const data = fs.readFileSync(file.path);
  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: file.name, // File name you want to save as in S3
    Body: data,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    res.send(`File uploaded successfully. ${data.Location}`);
    console.log(`File uploaded successfully. ${data.Location}`);
  });
});
app.get("/list", (req, res) => {
  s3.listObjectsV2({ Bucket: process.env.BUCKET_NAME }, (err, data) => {
    if (err) {
      res.sendStatus(400);
    }
    res.send(data.Contents);
  });
});
app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
