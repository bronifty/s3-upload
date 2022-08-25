const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const s3 = new S3Client();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bronifty-testbucket-12345',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

// app.post('/upload', upload.array('photos', 3), function (req, res, next) {
//   res.send('Successfully uploaded ' + req.files.length + ' files!');
// });
app.post('/upload_files', upload.array('files'), uploadFiles);
function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.files);
  res.send('Successfully uploaded ' + req.files.length + ' files!');
}

app.listen(5000, () => {
  console.log(`Server started...`);
});
