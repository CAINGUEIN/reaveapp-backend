console.log("dans tchat");

/** Voir comment connecter simulataneant plusieur Room
 * surement sur la method connectionWithRoom
 * avantage modifier l'etat de connection pour les autres en affichant sur tout les rooms du user si il est la
 * autre avantage notifier les message sur les room non ouverte
 */

exports.socketConnection = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONT_URL,
      methods: ["GET", "POST"],
    },
  });

  console.log("ici dans le socket");
  io.on("connection", (socket) => {
    console.log("ici dans le connection");
    socket.on("connectedUser", (user) => {
      socket.user = user;
      //créer une condition que si le user et invisible ne pas emit ça connection
      socket.broadcast.emit("user", user);
      console.log("ici dans le connected user");
    });
  });
};
