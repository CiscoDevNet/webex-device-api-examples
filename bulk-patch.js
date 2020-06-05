const axios = require("axios");
const parseLinkHeader = require("parse-link-header");

const ACCESS_TOKEN = "enter your access token here";

const searchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const patchConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json-patch+json",
  },
};

// Fill in any search limits you want to put on the selection of devices that you want to apply a setting to
const searchParams = [
  ["personId", null],
  ["placeId", null],
  ["orgId", null],
  ["displayName", null],
  ["product", null],
  ["tag", null],
  ["connectionStatus", null],
  ["serial", null],
  ["software", null],
  ["upgradeChannel", null],
  ["errorCode", null],
  ["capability", null],
  ["permission", null],
];

// Uncomment and replace example with setting(s) you want to bulk apply
const bulkSettings = [
  // {
  //   op: 'replace',
  //   path: 'NetworkServices.HTTP.Mode/sources/configured/value',
  //   value: 'HTTP+HTTPS',
  // },
  // {
  //   op: 'remove',
  //   path: 'NetworkServices.HTTP.Mode/sources/configured/value',
  // },
];

// Convert searchParamms into the params part of the url
const filteredParams = searchParams.filter(([key, value]) => value !== null);
const devicesQuery =
  filteredParams.length === 0
    ? ""
    : "?" + filteredParams.map(([key, value]) => `${key}=${value}`).join("&");

// Recursive function to fetch all devices across pages
const getDevices = (url, retries) => {
  return axios.get(url, searchConfig).then((result) => {
    console.log(`- Fetched ${url}`);
    if (result.headers.link) {
      // Replace is to work around a bug in the webexapis link header
      const link = parseLinkHeader(result.headers.link.replace(">", ">;"));
      return Promise.all([
        result.data.items,
        getDevices(link.next.url),
      ]).then((pages) => Array.prototype.concat.apply([], pages));
    } else {
      return result.data.items;
    }
  })
    .catch(error => {
      handleError(retries => getDevices(url, retries), `Fetching ${url}`, error, retries);
    });
};

const patchDevice = (device, url, body, retries) => {
  return axios
    .patch(url, body, patchConfig)
    .then(() => {
      console.log(`- Patched ${url} (${device.displayName})`);
    })
    .catch((error) => {
      handleError((retries) => patchDevice(device, url, body, retries), `Patching ${url} (${device.displayName})`, error, retries);
    });
};

const handleError = (operation, operationText, error, retries) => {
  if (error.response) {
    if (retries > 0 && error.response.headers.hasOwnProperty('Retry-After')) {
      console.log(`${error.response.status}: Retrying after ${error.response.headers['Retry-After']} ms`);
      return new Promise(resolve =>
        setTimeout(() => resolve(operation(retries - 1)), error.response.headers['Retry-After']));
    }
    console.log(
      `- ${operationText} resulted in a ${error.response.status}: ${error.response.data.message}. trackingid: ${error.response.headers.trackingid}`
    );
  }
};

// Patch every device with settings from bulkSettings
console.log("\nGetting devices...");
getDevices(`https://webexapis.com/v1/devices${devicesQuery}`).then(
  (devices) => {
    console.log(
      `\nApplying ${bulkSettings.length} settings to ${devices.length} devices...`
    );
    devices.forEach((device) => {
      const url = `https://webexapis.com/v1/deviceConfigurations/${device.id}`;
      const body = JSON.stringify(bulkSettings);
      patchDevice(device, url, body, 2);
    });
  }
);
