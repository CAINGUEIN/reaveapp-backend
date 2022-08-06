const Base = require("./axiosPlugin");

class ServicesApiLol {
  static async matchsList(puuid) {
    return Base.get(`by-puuid/` + puuid + `/ids?count=50`)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        console.log(e);
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
