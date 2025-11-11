import consolidateData from './consolidate-data.js'
const data = {
  user: {
    id: 5,
    info: { name: "Filip", email: null },
    skills: ["JS", "QA"]
  },
  original: true
};
consolidateData._storeKeyValuesToEnv(data, consolidateData._extractValuesFromArray(data))