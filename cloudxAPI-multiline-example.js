//NodeJS Example on how to post multiline commands to Webex Devices that allow cloud xapi commands"
const axios = require("axios");

const ACCESS_TOKEN =
    "enter your access token here";

const DEVICE_ID =
    "enter your deviceID here";

const jsonConfig = {
    headers: {
        "User-Agent": "Mozilla/5.0",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
};

const commandData = JSON.stringify({
    "deviceId": `${DEVICE_ID}`,
    "arguments": {},
    "body": "Webex Rooms Device\nAuthorised Access Only"
}, );

axios.post('https://webexapis.com/v1/xapi/command/SystemUnit.WelcomeBanner.Set', commandData, jsonConfig)
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })
