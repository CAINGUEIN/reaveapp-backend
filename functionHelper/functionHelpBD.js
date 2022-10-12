
function exist(collection, target, id) {
  const Model = require(`../models/${collection}`);
  let queryParam = {};
  queryParam[target] = id;
  return Model.find(queryParam).then((data) => {
    if (data.length > 0) {
      return true;
    }
    return false;
  });
}

module.exports = {
  exist
};