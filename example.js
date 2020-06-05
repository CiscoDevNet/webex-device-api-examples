const axios = require("axios");

const ACCESS_TOKEN =
  "enter your access token here";

const searchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const patchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json-patch+json",
  },
};

const signageData = JSON.stringify([
  {
    op: "replace",
    path: "Standby.Signage.Url/sources/configured/value",
    value: "nrk.no",
  },
  {
    op: "replace",
    path: "Standby.Signage.Mode/sources/configured/value",
    value: "On",
  },
  {
    op: "replace",
    path: "WebEngine.Mode/sources/configured/value",
    value: "On",
  },
  {
    op: "replace",
    path: "Standby.Delay/sources/configured/value",
    value: 120,
  },
]);

axios
  .get("https://webexapis.com/v1/devices?tag=signage", searchConfig)
  .then((result) => {
    for (let device of result.data.items) {
      axios
        .patch(
          `https://webexapis.com/v1/deviceConfigurations/${device.id}`,
          signageData,
          patchConfig
        )
        .then((result) => {
          console.log(result);
        }),
        (error) => {
          console.log(error);
        };
    }
  }),
  (error) => {
    console.log(error);
  };
