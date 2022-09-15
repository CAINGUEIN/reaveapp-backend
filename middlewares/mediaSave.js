const sharp = require("sharp");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: "Back-end",
  secretAccessKey: "Back-end",
  endpoint: "http://172.16.20.200:9000/",
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: "v4",
});

const MediaSave = {
  async imgResizeAvatar(req, res, next) {
    let resize = [160, 120, 60, 50, 40, 36, 24];
    let nameResize = ["xxl", "xl", "l", "m", "s", "xs", "xxs"];
    let success = [];
    for (let index = 0; index < resize.length; index++) {
      let img = await sharp(req.file.buffer)
        .resize({
          width: resize[index],
          height: resize[index],
        })
        .toBuffer();
      console.log(img);
      var params = {
        Bucket: "useravatar",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };

      s3.putObject(params, function (err, data) {
        let key = nameResize[index];
        let obj = {};

        if (err) {
          obj[key] = err;
          success.push(obj);
        } else {
          obj[key] = true;
          success.push(obj);
        }
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media avatar upload",
      data: success,
    });
  },

  async imgResizeBanner(req, res, next) {
    let resizeH = [100, 150, 188, 300];
    let resizeW = [442, 661, 829, 1322];
    let nameResize = ["preview", "status", "modale", "page"];
    let success = [];
    for (let index = 0; index < resizeH.length; index++) {
      let img = await sharp(req.file.buffer)
        .resize({
          width: resizeW[index],
          height: resizeH[index],
        })
        .toBuffer();
      console.log(img);
      var params = {
        Bucket: "userbanner",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };

      s3.putObject(params, function (err, data) {
        let key = nameResize[index];
        let obj = {};

        if (err) {
          obj[key] = err;
          success.push(obj);
        } else {
          obj[key] = true;
          success.push(obj);
        }
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media banner upload",
      data: success,
    });
  },
  imgSave(req, res, next) {
    next();
  },
};

module.exports = MediaSave;
