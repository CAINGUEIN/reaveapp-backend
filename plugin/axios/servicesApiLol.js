const Base = require("./axiosPlugin");

class ServicesApiLol {
  static async matchsList(puuid) {
    return Base.get(`by-puuid/` + puuid + `/ids?count=80`)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  }
  static async matchsListWithQuery(puuid, limitTime, start) {
    return Base.get(
      `by-puuid/` +
        puuid +
        `/ids?startTime=` +
        limitTime +
        `&start=` +
        start +
        `&count=100`
    )
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
