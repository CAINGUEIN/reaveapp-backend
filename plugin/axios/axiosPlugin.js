const axios = require("axios") ;

console.log(process.env.API_LOL_URL);

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
    if (error.response.status === 429) {
      // If the error has status code 429, retry the request
      return axios.request(error.config);
  }
    // Do something with request error
    return Promise.reject(error.response);
  }
);
