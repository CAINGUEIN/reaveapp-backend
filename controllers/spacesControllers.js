const SpaceModel = require("../models/space/space");
const DataSpaceModel = require("../models/space/dataSpace");
const UserModel = require("../models/user");
const CategoryModel = require("../models/chats/cathegories");
const RoomModel = require("../models/chats/rooms");
const MessagesModel = require("../models/chats/messages");

//TODO: si trop de bug voir a faire des transaction

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
    //creation d'une room par default
    let createRoom = {
      name: "default",
    };
    const newRoom = await RoomModel.create(createRoom).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (newRoom === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create room",
      });
    }

    //création d'une cathegory general
    let createCathegory = {
      name: "general",
      _id_rooms: newRoom._id,
    };
    const newCategory = await CategoryModel.create(createCathegory).catch(
      (err) => {
        console.log(err);
        return "erreur";
      }
    );
    if (newCategory === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create category",
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
      _id_categories: newCategory._id,
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
    console.log(req.decodedToken._id);
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $push: { spaces: updateSpace._id },
      },
      { new: true, runValidators: true }
    )
      .populate("spaces")
      .exec((err, user) => {
        if (err) {
          return res.status(400).send({
            success: false,
            message: "Erreur data user",
            data: err,
          });
        }
        return res.status(200).send({
          success: true,
          message: "create space ok",
          data: user,
          idNewSpace: updateSpace._id,
        });
      });
  },
  async addUserInSpace(req, res) {
    // avoir l'id du dataOfSpace, du user qui invite et l'invité

    // trouvé le dataOf Space
    const dataOfSpace = await DataSpaceModel.findById(req.body.dataOfSpace.id);

    // cherché si le user qui invite a le droit
    // pour le moment pas de droit mais au moins qui soit dans le space
    const userHost = await dataOfSpace.users
      .findById(req.decodedToken._id)
      .catch((err) => {
        console.log(err);
        return "erreur";
      });
    if (userHost === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error permission User",
      });
    }

    //add le userGest
    addUserGest = {
      users: {
        _id_user: req.userGest._id,
        _id_roles: "user",
        _id_permissions: "user",
      },
    };

    const updateData = await dataOfSpace.users
      .push(addUserGest)
      .save()
      .catch((err) => {
        console.log(err);
        return "erreur";
      });
    if (updateData === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update Space",
      });
    }

    return res.status(200).send({
      success: true,
      message: "add User in space ok",
      data: updateData,
    });
  },
  async deleteSpace(req, res) {
    //le plus simple serais d'avoir le dataOfSpace car
    // l'id des users pour leur retiré l'acces au space delete
    // id du space pour le desactivé
    // et peut etre utile aussi les cathegory du chat

    //recup de la data
    const dataOfSpace = await DataSpaceModel.findById(req.body.dataOfSpace.id);

    //update des users pour leur retirer le space
    const updateInUsers = await UserModel.findByIdAndUpdate(
      dataOfSpace.users._id_user,
      { $pull: { spaces: req.body.dataOfSpace.id } },
      { runValidators: true }
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (updateInUsers === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update user",
      });
    }

    //dans un premier temps delete du space mais peut etre pour la production mise en 40aine
    //pour une remise en ligne en cas d'erreur
    const removeSpace = await SpaceModel.findOneAndDelete(
      dataOfSpace._id_space
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (removeSpace === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error remove space",
      });
    }

    //pour le moment je ne traite pas de l'historique des cathegories et room qui sont toujours stocké
    return res.status(200).send({
      success: true,
      message: "remove space Ok",
      data: updateUser,
      idNewSpace: updateSpace._id,
    });
  },
  async checkSpace(req, res) {
    SpaceModel.findById(req.body._id)
      .populate("dataOfSpace")
      .exec((err, space) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data space",
            data: err,
          });
        return res.status(200).send({
          success: true,
          message: "Ok data space",
          data: space,
        });
      });
  },
  async allRooms(req, res) {
    DataSpaceModel.findById(req.body._id)
      .populate({
        path: "_id_categories",
        populate: {
          path: "_id_rooms",
        },
      })
      .exec((err, allRooms) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data space for allRooms",
            data: err,
          });
        return res.status(200).send({
          success: true,
          message: "Ok data space for allRooms",
          data: allRooms,
        });
      });
  },
  async addRoom(req, res) {
    console.log(req.body);

    //créer la room
    let createRoom = {
      name: req.body.name,
    };
    const newRoom = await RoomModel.create(createRoom).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (newRoom === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create room",
      });
    }

    //recup la category
    //et ajouté la room dans la category
    const category = await CategoryModel.findByIdAndUpdate(
      req.body._id_category,
      {
        $push: { _id_rooms: newRoom._id },
      }
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (category === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error add room in category",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Ok create room and add in category",
    });
  },
  async deleteRoom(req, res) {
    //TODO: voir a mettre la room delete en 40aine pour la remettre a la demande du user
    console.log(req.body);
    //recup toute le message de la room et les deletes
    const room = await RoomModel.findById(req.body._id_room).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (room === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error room data",
      });
    }
    const deleteMessages = await MessagesModel.findByIdAndDelete(
      room._id_messages
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (deleteMessages === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error delete messages for room",
      });
    }
    //recup la category et effacer la room
    const category = await CategoryModel.findByIdAndUpdate(
      req.body._id_categories,
      {
        $pull: { _id_rooms: req.body._id_rooms },
      }
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (category === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update category for delete room",
      });
    }
    //delete la room
    const roomDelete = await RoomModel.findByIdAndDelete(req.body._id_room).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (roomDelete === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error room data",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Ok delete room",
    });
  },
  async addCategory(req, res) {
    //créer la category
    let createCategory = {
      name: req.body.name,
    };
    const newCategory = await CategoryModel.create(createCategory).catch(
      (err) => {
        console.log(err);
        return "erreur";
      }
    );
    if (newCategory === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error create category",
      });
    }
    //recup la space
    //et ajouté la category dans le space
    const category = await DataSpaceModel.findByIdAndUpdate(
      req.body._id_dataOfSpace,
      {
        $push: { _id_categories: newCategory._id },
      }
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (category === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error add category in space",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Ok create category and add in space",
    });
  },
  async deleteCategory(req, res) {
    //TODO: voir a mettre la category delete en 40aine pour la remettre a la demande du user
    //recup la category
    const category = await CategoryModel.findById(req.body._id_category).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (category === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error recup category",
      });
    }
    //recup toute les room de la category
    const rooms = await RoomModel.find({_id: category._id_rooms}).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (rooms === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error recup rooms",
      });
    }
    //delete les messages des rooms
    rooms.forEach(room => {
      const deleteMessages = MessagesModel.findByIdAndDelete(
        room._id_messages
      ).catch((err) => {
        console.log(err);
        return "erreur";
      });
      if (deleteMessages === "erreur") {
        return res.status(400).send({
          success: false,
          message: "error delete messages for room",
        });
      }
    });
    //delete la room
    const roomDelete = await RoomModel.findByIdAndDelete(category._id_rooms).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (roomDelete === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error room data",
      });
    }
    //recup la dataOfSpace et effacer la category
    const dataOfSpace = await DataSpaceModel.findByIdAndUpdate(
      req.body._id_dataOfSpace,
      {
        $pull: { _id_categories: req.body._id_category },
      }
    ).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (dataOfSpace === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error update dataOfSpace for delete category",
      });
    }
    //delete la category
    const categoryDelete = await CategoryModel.findByIdAndDelete(req.body._id_category).catch((err) => {
      console.log(err);
      return "erreur";
    });
    if (categoryDelete === "erreur") {
      return res.status(400).send({
        success: false,
        message: "error delete room",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Ok delete category",
    });
  },
};

module.exports = SpaceControllers;
