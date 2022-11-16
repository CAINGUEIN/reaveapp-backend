const searchControllers = {
  //ici une suite de services pour faire des recherche
  async usersList(req, res) {
    //console.log(req.usersNameList, req.profileNameList);
    let usersList = req.usersTagList;
    //je doit verifier pour chaque usersList
    req.profileNameList.map((profileName) => {
      //il n'est pas dans chaque profileNameList._id
      let found = usersList.find((list) => {
        if (list._id.equals(profileName._id)) return true;
      });
      console.log("ici", found);
      if (found) {
        console.log("match find");
      } else {
        //si pas de match alors push dans la userList
        usersList.push(profileName);
      }
    });

    //ici renvoyer la list des user avec la picture userName profileName _id
    return res.status(200).send({
      success: true,
      message: "Ok userlist",
      data: usersList,
    });

  },
};

module.exports = searchControllers;
