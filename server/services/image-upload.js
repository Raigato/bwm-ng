const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('../config')

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-2'
})

const s3 = new aws.S3()

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(new Error('Invalid file type, only JPEG and PNG are allowed!'), false)
  }
}
 
const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'bmw-ng-dev',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_METADATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload