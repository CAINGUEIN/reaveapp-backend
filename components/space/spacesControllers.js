const SpaceModel = require("../../models/space");
const UserModel = require("../../models/user");

//TODO: si trop de bug voir a faire des transaction

const SpaceControllers = {
  async createSpace(req, res) {
    //creation des default data
    let createValues = {
      typeOfSpace: req.body.type,
      nameSpace: req.body.profile,
      dataOfSpace: {
        users: {
          _id_user: req.decodedToken._id,
          _id_roles: "god",
          _id_permissions: "god",
        },
        categories: {
          name: "Hi,",
          rooms: {
            name: "Welcome,",
            messages: {
              message: "Welcome in the new Space",
            },
          },
        },
      },
    };
    // creation du Space
    SpaceModel.create(createValues)
      .then((resultSpace) => {
        //si ok rajout du nouveau space dans le user créateur
        UserModel.findByIdAndUpdate(
          req.decodedToken._id,
          {
            $push: { spaces: resultSpace._id },
          },
          { new: true, runValidators: true }
        )
          .then((resultUser) => {
            return res.status(200).send({
              success: true,
              message: "create space ok",
              data: {
                newSpace: resultSpace,
                updateSpaceUser: resultUser.spaces,
              },
            });
          })
          .catch((err) => {
            SpaceModel.findByIdAndDelete(resultSpace._id);
            //si non rien on sort
            return res.status(400).send({
              success: false,
              message: "Erreur data user",
              data: err,
            });
          });
      })
      .catch((err) => {
        //si non rien on sort
        return res.status(400).send({
          success: false,
          message: "Erreur data space",
          data: err,
        });
      });
  },
  async addUserInSpace(req, res) {
    //faire un middleware pour verifier les droit
    /* a besoin
    _id_user = user guest
    _id_space = space host
    usernameHost = user as permission fort host other user
     */
    let datapush = {
      _id_user: req.body._id_user,
      //TODO: voir quoi faire pour les role et perm
      _id_roles: "new",
      _id_permissions: "guest",
    };
    // target le space
    SpaceModel.findByIdAndUpdate(
      req.body._id_space,
      {
        // rajouter un user avec les permission et role
        $push: { dataOfSpace: { users: datapush } },
      },
      { new: true, runValidators: true }
    )
      .then((space) => {
        //faire un push dans le notif du user pour qu'il puisse valider l'invitation
        let notifPush = {
          type: "addSpace",
          content:
            req.body.usernameHost +
            " vous invite dans le space " +
            space.nameSpace,
          data: space._id,
        };
        UserModel.findByIdAndUpdate(
          req.body._id_user,
          {
            // puis rajouter la demande dans la notification
            $push: { notifications: notifPush },
          },
          { new: true, runValidators: true }
        )
          .then(() => {
            return res.status(200).send({
              success: true,
              message: "Ok add new user in space",
            });
          })
          .catch((err) => {
            return res.status(400).send({
              success: false,
              message: "Erreur add space id in user",
              data: err,
            });
          });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add user in space",
          data: err,
        });
      });
  },
  async deleteSpace(req, res) {
    //utilisé le middleware crée pour la verification des droit
    // target le space
    //recup tout les users dans le data of space
    //effacé dans la liste des users recup le space
    //puis effacer le space
  },
  async infoAllSpaceForUser(req, res) {
    SpaceModel.find({
      "dataOfSpace.users._id_user": req.decodedToken._id,
    })
      .populate("dataOfSpace.users._id_user", "userTag profileName")
      .exec((err, space) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data space",
          });
        if (space === null) {
          return res.status(400).send({
            success: false,
            message: "Erreur space delete",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Ok data space",
          data: space,
        });
      });
  },
  async checkSpace(req, res) {
    SpaceModel.find()
      .then((space) => {
        return res.status(200).send({
          success: true,
          message: "Ok data space",
          data: space,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur data space",
          data: err,
        });
      });
  },
  async allRooms(req, res) {
    SpaceModel.findById(req.body._id)
      .then((space) => {
        return res.status(200).send({
          success: true,
          message: "Ok data space for allRooms",
          data: space.dataOfSpace.categories,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur data space for allRooms",
          data: err,
        });
      });
  },

  async addPrimaryPicSpace(imageName, spaceId, res) {
    console.log('AAAAAAAAAAAAAA : ', imageName, spaceId)
    SpaceModel.findOneAndUpdate({
        _id: spaceId
      }, {
        $set: {
          picture: imageName
        },
      }, {
        new: true,
        runValidators: true
      }).then((updatedSpace) => {
        if (updatedSpace) {
          console.log("Import réussi!")
          res.status(200).send({
            success: true,
            message: "Image added to primary pics",
            data: updatedSpace
          });
        } else {
          res.status(404).send({
            success: false,
            message: "Space not found"
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Error adding image to primary pics",
          error: err
        });
      });
  },
  async addRoom(req, res) {
    //utilisé le middleware crée pour la verification des droit
    // target le space
    //rajouter une room dans la bonne category
  },
  async deleteRoom(req, res) {
    //TODO: voir a mettre la room delete en 40aine pour la remettre a la demande du user
    //utilisé le middleware crée pour la verification des droit
    // target le space et la category
    //recup la room et la delete
  },
  async addCategory(req, res) {
    //utilisé le middleware crée pour la verification des droit
    // target le space
    //rajouter une cate
  },
  async deleteCategory(req, res) {
    //TODO: voir a mettre la category delete en 40aine pour la remettre a la demande du user
    //utilisé le middleware crée pour la verification des droit
    // target le space
    //recup la category et la delete
  },
};

module.exports = SpaceControllers;
