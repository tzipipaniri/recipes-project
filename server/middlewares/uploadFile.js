const multer = require('multer')
const fs = require('fs');

// 1.
// const upload = multer({ dest: 'uploads/' });

// 2.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/uploads`.replace('\\middlewares', ''))
    },
    filename: function (req, file, cb) {
        if (file) {

            const myName = file.originalname;
            // const myName = Date.now() + '-' + file.originalname;
            console.log(`Saving file with name: ${myName}`); // לוג לשם הקובץ
            cb(null, myName); // להמשיך הלאה למידלוואר הבא
        }
    }
});

function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    if (file&&file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
        // To accept the file pass `true`, like so:
        cb(null, true);

    else {
        // To reject this file pass `false`, like so:
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter });


module.exports.upload = upload;