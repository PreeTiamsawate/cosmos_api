if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

var aws = require("aws-sdk");
var express = require("express");
var multer = require("multer");
var multerS3 = require("multer-s3-v3");
var app = express();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

var s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    })
});

app.post("/upload", upload.fields([ {
    name: 'image_1', maxCount: 1
  },{
    name: 'image_2', maxCount: 1
  }
]), function (req, res, next) {
    if(!req.files.image_2){
        console.log("No image 2");
    }
    
    res.send(req.files);
});

// var params = {  Bucket: bucketName, Key: 'test/1654672608910' };

const s3Delete=function(bucketName, key){
    s3.deleteObject({  Bucket: bucketName, Key: key }, function(err, data) {
        if (err){// error
          console.log(err, err.stack);
          throw err   
        } 
        else {console.log("Deleted");     }                // deleted
      });
} 

// s3Delete(bucketName,'favicon.ico1654861655479')

app.listen(process.env.PORT || 4000, () => {
    console.log("ON PORT 4000")
});