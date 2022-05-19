const MessageModel = require("../models/chats/messages.js");
const RoomModel = require("../models/chats/rooms");

let io;

let users = [];
let messages = [];
console.log("dans tchat");

exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //join room
    socket.on("connectionWithRoom", (data) => {
      socket.leaveAll();
      socket.join(data.room);
      socket.room = data.room;
      socket._id_user = data._id_user;
      RoomModel.findById(data.room)
        .populate({
          path: "_id_messages",
          populate: {
            path: "_id_sender",
          },
        })
        .exec((err, result) => {
          console.log(result);
          if (err) {
            return err;
          }
          socket.emit("loggedIn", {
            users: users,
            messages: result,
          });
        });
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
