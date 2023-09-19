const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs')
const path = require('path')
const { promisify } = require('util');
const heicConvert = require('heic-convert');
const Sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const rootDir = path.dirname(require.main.filename || process.mainModule.filename);
const uploadDir = path.join(rootDir, '/uploads');
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const { APP_PREFIX } = require('../config/configuration_constant');
const REMOVE_AFTER_UPLOAD = Boolean(process.env.REMOVE_AFTER_UPLOAD) || false;
const { IMAGE_QUALITY } = require('../config/configuration_constant');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: async function (req, file, cb) {
        const filenameDotSplit = file.originalname.split('.');
        const fileExtension = filenameDotSplit[filenameDotSplit.length - 1] // get file extension from original file name
        cb(null, APP_PREFIX + '-' + uuidv4() + '.' + fileExtension);
    }
});

const upload = multer({ storage: storage });

/**
 * S3 instance will config.
 */
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

/**
 * File upload to s3.
 * @param {*} file 
 */
const uploadFile = async (file) => {
    const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf']
    if (!file.every((item) => validFileTypes.includes(item.mimetype))) throw 'File type not supported'
    let responseData = []
    for (const item of file) {
        await fs.readFile(item.path, async (err, data) => {
            if (err) throw err;
            const params = {
                Bucket: BUCKET_NAME + '/nimiapp', // pass your bucket name
                Key: item.filename, // file will be saved as testBucket/contacts.csv
                Body: data,
                ACL: 'public-read'
            };
            s3.upload(params, function (s3Err, data) {
                if (s3Err) throw s3Err
                else {
                    responseData.push(data.Location)
                    if (data) {
                        if (fs.existsSync(item.path)) {
                            fs.unlinkSync(item.path);
                        }
                    }
                    if (responseData.length == file.length) {
                        return responseData

                    }
                }
            });
        });
    }
};

/**
 * Upload image to s3 using multer file.
 * @param {*} file 
 * @param {*} bucketFolder 
 * @returns 
 */
const uploadImage = async (file, bucketFolder, quality = IMAGE_QUALITY) => {
    let input = file.path;
    const fileParts = file.filename.split('.');
    const newFilename = `${fileParts[0]}.jpg`;
    const newFileTemp = path.join(uploadDir, newFilename);
    const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/heic', 'image/heif', 'image/tiff'];
    const heicTypes = ['image/heic', 'image/heif'];

    if (!validFileTypes.includes(file.mimetype)) {
        throw 'File type not supported';
    }
    try {
        if (heicTypes.includes(file.mimetype)) {
            try {
                const buffer = await promisify(fs.readFile)(file.path);
                const data = await heicConvert({
                    buffer: buffer,
                    format: 'JPEG'
                });

                // Assign converted JPEG data to input for Sharp
                input = data;

                await promisify(fs.writeFile)(newFileTemp, input);
            } catch (e) {
                console.error('Could not convert from HEIC', { error: e.stack });
            }
        }
        let fileStream;

        try {
            fileStream = await Sharp(input).jpeg({ quality: parseInt(quality) }).flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer();
        } catch (e) {
            console.error('Could not create Sharp instance from input', { input });
        }

        const params = {
            Bucket: `${BUCKET_NAME}/${bucketFolder}`, // pass your bucket name
            Key: newFilename,
            Body: fileStream
        };
        const uploaded = await s3.upload(params).promise().catch((err) => {
            console.error('Could not upload', err);
        });
        if (REMOVE_AFTER_UPLOAD) {
            if (fs.existsSync(newFileTemp)) {
                fs.unlink(newFileTemp, (err) => {
                    if (err) {
                        console.error('Could not delete file', {
                            newFileTemp
                        });
                    }
                });
            }
        }

        console.log("Uploaded", { uploaded });

        return uploaded;
    } catch (error) {
        console.error("error>>>", error)
    }
}

/**
 * Upload image using base 64 stram of data.
 * @param {*} base64 
 * @param {*} bucketFolder 
 * @returns 
 */
const imageUpload64 = async (base64, bucketFolder) => {
    const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = base64.split(';')[0].split('/')[1];
    const name = `file-${Math.floor(10000000000 + Math.random() * 90000000000)}.${type}`;

    const params = {
        Bucket: BUCKET_NAME + '/' + bucketFolder,
        Key: name, // type is not required
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: `image/${type}` // required. Notice the back ticks
    }
    let location = '';
    let key = '';
    try {
        const { Location, Key } = await s3.upload(params).promise();
        location = Location;
        key = Key;
    } catch (error) {
        console.error(error, "error")
    }
    return location;
}

/**
 * Delete image from s3 bucket.
 * @param {*} file 
 * @param {*} bucketFolder 
 */
const deleteImage = async (file, bucketFolder) => {
    try {
        const bucketParams = {
            Bucket: BUCKET_NAME,
            Key: bucketFolder + '/' + file
        };
        const data = await s3.deleteObject(bucketParams).promise();
    } catch (err) {
        console.error("Error", err);
    }
}

module.exports = { upload, uploadFile, imageUpload64, s3, uploadImage, deleteImage }