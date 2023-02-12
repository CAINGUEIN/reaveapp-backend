const axios = require("axios") ;

const Ddragon = axios.create({
    baseURL: process.env.LOL_DATA,
  });
  module.exports = Ddragon;

class riotServices {
  static async version() {
    console.log(Ddragon, process.env.LOL_DATA);
    return Ddragon.get(`api/versions.json`)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  static async versionData(MAJ, target) {
    return Ddragon.get(`cdn/` + MAJ + "/data/en_US/" + target + ".json")
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }
}

module.exports = riotServices;