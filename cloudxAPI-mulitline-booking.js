//NodeJS Example on how to post multiline commands to Webex Devices that allow cloud xapi commands"
//This example will show how to use the new booking api available on cloud endpoints from July 2020
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
    "body": {
        "Bookings": [{
            "Id": "foo",
            "Title": "Booking Title",
            "Protocol": "SIP",
            "Time": {
                "StartTime": "2020-07-01T13:00:00Z",
                "Duration": 60
            },
            "Organizer": {
                "Name": "John Doe"
            },
            "Number": "number@example.com"
        }]
    }
}, );

axios.post('https://webexapis.com/v1/xapi/command/Bookings.Put', commandData, jsonConfig)
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })
