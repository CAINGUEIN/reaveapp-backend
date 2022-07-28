const ModelVersion = require("../../models/LOLVersion/versionJSON");
const riotServices = require("./riotServices");

exports.riotCheck = async () => {
  let MAJ = "";
  let interval = 6000000;
  console.log("bonjour");
  const result = await ModelVersion.find()
  if (result.length === 0) {
    let version = await checkVersionFromRiot("");
    console.log(version);
    if (version) {
      MAJ = version;
      let isVersion = await checkVersionFromBack(MAJ);
      if (!isVersion) {
        createNewVersion(MAJ);
      } else {
        console.log('version a jour');
      }
    } else {
      console.log("pas de version");
    }
  }
  setInterval(async () => {
    let version = await checkVersionFromRiot(MAJ);
    if (version) {
      MAJ = version;
      let isVersion = await checkVersionFromBack(MAJ);
      if (!isVersion) {
        createNewVersion(MAJ);
      } else {
        console.log('version a jour');
      }
    } else {
      console.log("pas de version");
    }
  }, interval);
};

async function checkVersionFromRiot(MAJ) {
  const result = await riotServices.version();
  if (result.status === 200 && MAJ !== result.data[0]) {
    return result.data[0];
  } else {
    return false;
  }
}

async function checkVersionFromBack(MAJ) {
  const result = await ModelVersion.find({ version: MAJ });
  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function createNewVersion(MAJ) {
  let target = [
    "summoner",
    "runesReforged",
    "map",
    "item",
    "champion",
    "championFull",
    "item",
  ];
  let data = await createData(target, MAJ);
  data.version = MAJ ;
  console.log(data, "ici");
  console.log("create new version");
  ModelVersion.create(data);
}

async function createData(target, MAJ) {
  let dataCreate = {
    summoner: "",
    runesReforged: "",
    map: "",
    item: "",
    champion: "",
    championFull: "",
    item: "",
  };
  for await (const req of target) {
    const result = await riotServices.versionData(MAJ, req);
    dataCreate[req] = result.data ;
  }
  return dataCreate;
}
