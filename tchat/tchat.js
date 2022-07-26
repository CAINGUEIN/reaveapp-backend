const UserModel = require("../models/user");
const SpaceModel = require("../models/space")

let io;

let users = [];
let messages = [];
console.log("dans tchat");

/** Voir comment connecter simulataneant plusieur Room
 * surement sur la method connectionWithRoom
 * avantage modifier l'etat de connection pour les autres en affichant sur tout les rooms du user si il est la
 * autre avantage notifier les message sur les room non ouverte
 */

exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    cors: {
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //join room
    socket.on("connectionWithRoom", (data) => {
      if (socket.room !== data.room) {
        socket.room = data.room;
        socket.join(socket.room);
      }
      socket._id_user = data._id_user;
      SpaceModel.findById(data._id_space)
        .then((result)=>{
          socket.emit("loggedIn", {
            users: users,
            messages: result.dataOfSpace/* voir comment faire mais en gros l'idée serait de renvoyer tout le 
            message d'un space avec peut etre une limite des 50 derniers 
            avec pour espect de pouvoir mettre un symbole pour prevenir d'un nouveau message*/,
          });
        })
        .catch((err)=>{
          return res.status(400).send({
            success: false,
            message: "Erreur socket",
          })
        })
    });

    //New User
    socket.on("newUser", (username) => {
      console.log(username + " a fait un entrée fracassante");
      socket.username = username;
      io.emit("userOnline", socket.username);
    });

    //New Message
    socket.on("msg", (msg) => {
      let message = new MessageModel({
        _id_sender: socket._id_user,
        content: msg,
      });
      message.save((err, result) => {
        if (err) throw err;
        MessageModel.findById(result._id)
          .populate("_id_sender")
          .exec((err, result) => {
            if (err) throw err;
            messages.push(result);
            io.emit("msg", result);
          });
      });
      console.log(message);
      RoomModel.findByIdAndUpdate(socket.room, {
        $push: { _id_messages: message._id },
      })
        .then((room) => {
          console.log("ok");
        })
        .catch((err) => {
          console.log("ok");
        });
    });

    //Delete Message
    socket.on("deleteMsg", (msg, key) => {
      MessageModel.findByIdAndRemove(msg)
        .then(() => {
          console.log("Suppression Ok", msg, key);
          messages.splice(key, 1);
          io.emit("deleteMsg", key);
        })
        .catch(() => {});
    });

    //Disconnect
    socket.on("disconnect", () => {
      console.log(socket.username + " c'est barré");
      io.emit(socket.username + " c'est barré");
      users.splice(users.indexOf(socket), 1);
    });
  });
};
