const axios = require("axios") ;

const Base = axios.create({
  baseURL: process.env.API_LOL_URL,
});
module.exports = Base;

Base.interceptors.request.use(
  function (config) {
    config.headers["X-Riot-Token"] = process.env.API_LOL;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
