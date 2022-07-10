const Base = require("./axiosPlugin");

class ServicesApiLol {
  static async matchsList(puuid) {
    return Base.get(`by-puuid/` + puuid + `/ids/`)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  static async dataMatchInfo(idMatch) {
    return Base.get(`/` + idMatch)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  static async dataMatchTimeline(idMatch) {
    return Base.get(idMatch + `/timeline`)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }
}

module.exports = ServicesApiLol;
