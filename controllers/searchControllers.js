const UserModel = require("../models/user");
const mongoose = require("mongoose");

const searchControllers = {
  //ici une suite de services pour faire des recherche
  async usersList(req, res) {
    //console.log(req.usersNameList, req.profileTagList);
    let usersList = req.usersNameList;
    //je doit verifier pour chaque usersList
    req.profileTagList.map((profileTag) => {
      //il n'est pas dans chaque profileTagList._id
      let found = usersList.find((list) => {
        if (list._id.equals(profileTag._id)) return true;
      });
      console.log("ici", found);
      if (found) {
        console.log("match find");
      } else {
        //si pas de match alors push dans la userList
        usersList.push(profileTag);
      }
    });

    //ici renvoyer la list des user avec la picture userName profileTag _id
    return res.status(200).send({
      success: true,
      message: "Ok userlist",
      data: usersList,
    });

  },
};

module.exports = searchControllers;
