const ChatModel = require("../models/chats/chat");

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
    socket.on("connectionWithRoom", (user, room) => {
      socket.join(room)
      ChatModel.find((err, result) => {
        if (err) throw err;
        messages = result;
      });
    });

    socket.emit("loggedIn", {
      users: users.map((s) => s.username),
      messages: messages,
    });

    //New User
    socket.on("newUser", (username) => {
      console.log(username + " a fait un entrée fracassante");
      socket.username = username;
      users.push(socket);

      io.emit("userOnline", socket.username);
    });

    //New Message
    socket.on("msg", (msg) => {
      let message = new ChatModel({
        user: socket.username,
        msg: msg,
      });

      message.save((err, result) => {
        if (err) throw err;
        messages.push(result);
        io.emit("msg", message);
      });
    });

    //Delete Message
    socket.on("deleteMsg", (msg, key) => {
      ChatModel.findByIdAndRemove(msg)
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
