const sharp = require("sharp");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSMINIO,
  secretAccessKey: process.env.SECRETACCESSMINIO,
  endpoint: process.env.ENDPOINTMINIO,
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
      .toFormat("png")
      .png({ force: true })
      .toBuffer();
      console.log(index, img);
      var params = {
        Bucket: "useravatar",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };
      await new Promise((resolve, reject) => {
        s3.putObject(params, function (err, data) {
          let key = nameResize[index];
          let obj = {};
          if (err) {
            console.log(err);
            obj[key] = err;
            success.push(obj);
          } else {
            console.log(true);
            obj[key] = true;
            success.push(obj);
          }
          resolve();
        });
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
        .toFormat("png")
        .png({ force: true })
        .toBuffer();
      var params = {
        Bucket: "userbanner",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };
      await new Promise((resolve, reject) => {
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
          resolve();
        });
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media banner upload",
      data: success,
    });
  },

  async imgResizeEvent(req, res, next) {
    let resizeH = [40, 64, 149, 318, 390];
    let resizeW = [40, 64, 149, 318, 390];
    let nameResize = ["xs", "s", "m", "l", "xl"];
    let success = [];
    for (let index = 0; index < resizeH.length; index++) {
      let img = await sharp(req.file.buffer)
        .resize({
          width: resizeW[index],
          height: resizeH[index],
        })
        .toFormat("png")
        .png({ force: true })
        .toBuffer();
      var params = {
        Bucket: "eventpp",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };
      await new Promise((resolve, reject) => {
        s3.putObject(params, function (err, data) {
          let key = nameResize[index];
          let obj = {};
          if (err) {
            console.log(err);
            obj[key] = err;
            success.push(obj);
          } else {
            console.log(true);
            obj[key] = true;
            success.push(obj);
          }
          resolve();
        });
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media banner upload",
      data: success,
    });
  },

  async imgResizeItem(req, res, next) {
    let resizeH = [149];
    let resizeW = [149];
    let nameResize = ["m"];
    let success = [];
    for (let index = 0; index < resizeH.length; index++) {
      let img = await sharp(req.file.buffer)
        .resize({
          width: resizeW[index],
          height: resizeH[index],
        })
        .toFormat("png")
        .png({ force: true })
        .toBuffer();
      var params = {
        Bucket: "equipmentpp",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };
      await new Promise((resolve, reject) => {
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
          resolve();
        });
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media banner upload",
      data: success,
    });
  },

  async imgResizeProfileFriend(req, res, next) {
    let resize = [60, 50, 36];
    let nameResize = ["l", "m", "xs"];
    let success = [];
    for (let index = 0; index < resize.length; index++) {
      console.log(nameResize[index] + req.file.originalname);
      let img = await sharp(req.file.buffer)
        .resize({
          width: resize[index],
          height: resize[index],
        })
        .toFormat("png")
        .png({ force: true })
        .toBuffer();
      var params = {
        Bucket: "profilespace",
        Key: nameResize[index] + req.file.originalname,
        ContentType: "image/gif",
        Body: img,
      };
      await new Promise((resolve, reject) => {
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
          resolve();
        });
      });
    }
    res.status(200).send({
      success: true,
      message: "Ok media profile friend upload",
      data: success,
    });
  },
};

module.exports = MediaSave;
