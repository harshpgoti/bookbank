const multer = require('multer'),
multerS3 = require('multer-s3'),
{ awsSDK } = require('../config/default.json'),
{ v4: uuidv4 } = require('uuid'),
AWS = require('../helper/aws-sdk')

const s3 = new AWS.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: awsSDK.bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: awsSDK.acl,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      let directory = awsSDK.directory.docs;
      let file_name = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
      if(file.mimetype.split('/')[1] == "epub+zip")
        file_name = `${uuidv4()}.${file.mimetype.split('/')[1].split('+')[0]}`;
      cb(null, `${directory}/${file_name}`)
    }
  }),
  limits:{fileSize:2000000},
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf" || file.mimetype == "application/epub+zip") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
})


module.exports = upload;