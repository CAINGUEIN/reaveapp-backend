const SpaceModel = require("../models/space/space");
const DataSpaceModel = require("../models/space/dataSpace");
const UserModel = require("../models/user");

const SpaceControllers = {
  async createSpace(req, res) {
    //ici on doit recup toute les infos avant de le passer dans le insertMany
    /**
     *
     * createValues: {
     * typeOfSpace: req.body.type,
     * nameSpace: req.body.profile
     * birthday: req.body.birthday
     * picture: req.picture.url
     * bio: req.body.bio
     * }
     */

    //creation du space en premier pour verifier la duplication
    let createValues = {
      typeOfSpace: req.body.type,
      nameSpace: req.body.profile,
      bio: req.body.bio,
    };
    const newSpace = await SpaceModel.create(createValues).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (newSpace === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create Space",
      });
    }
    //creation de la data pour l'associer au space
    let createData = {
      users: {
        _id_user: req.decodedToken._id,
        _id_roles: "god",
        _id_permissions: "god",
      },
      _id_space: newSpace._id,
    };
    const newData = await DataSpaceModel.create(createData).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (newSpace === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create data",
      });
    }

    //rajout de l'id data dans le space
    newSpace.dataOfSpace = newData._id;

    const updateSpace = await newSpace.save().catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (newSpace === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update Space",
      });
    }

    //recup l'id du space et le rajouté dans le user
    // puis renvoyer la nouvelle liste de space pour une mise a jour du client
    const updateUser = await UserModel.findOneAndUpdate(req.decodedToken._id, {
      $push: { spaces: updateSpace._id },
    }).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (updateUser === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update user",
      });
    }

    return res.status(200).send({
      success: true,
      message: "create space ok",
      data: updateUser,
      idNewSpace: updateSpace._id
    });
  },
  async checkSpace(req, res) {
    console.log(req.body._id);
    SpaceModel.findById(req.body._id)
      .populate("dataOfSpace")
      .exec((err, space) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data space",
            data: err
          });
        return res.status(200).send({
          success: true,
          message: "Ok data space",
          data: space,
        });
      });
  },
};

module.exports = SpaceControllers;
