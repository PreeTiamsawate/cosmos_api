var aws = require("aws-sdk");
var multerS3 = require("multer-s3-v3");

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
var s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey
});

const storage= multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, file.originalname+Date.now().toString()+Math.floor(Math.random() * 90 + 10).toString());
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
})
const s3Delete=function(bucketName, key){
    s3.deleteObject({  Bucket: bucketName, Key: key }, function(err, data) {
        if (err){// error
          console.log(err, err.stack);
          throw err   
        } 
        else {console.log("Deleted "+ key+ " from "+bucketName+" bucket.");     }                // deleted
      });
} 

module.exports = {
    s3,
    storage,
    bucketName,
    s3Delete
}