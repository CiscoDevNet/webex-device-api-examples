# Webex Devices APIs example scripts

Here you'll find scripts that illustrate how to use the [Devices](https://developer.webex.com/docs/api/v1/devices) and [Device Configurations](https://developer.webex.com/docs/api/v1/device-configurations) APIs.

## How to run the scripts

1. Make sure you have node installed, either [directly](https://nodejs.org/en/download/) or through a [package manager](https://nodejs.org/en/download/package-manager/).

2. Install depencies: `npm install`

3. Edit the script you want to run. Most will for example have a `const ACCESS_TOKEN = "enter your access token here";` line that you'll need to update with your [token](https://developer.webex.com/docs/api/getting-started#accounts-and-authentication). Read through the comments in the script to see if there is more you need to fill in.

4. Run the script: `node <script name>`

## The scripts

**example.js**: Enables signage and sets it to `nrk.no` for all devices with the tag `signage`.

**bulk-patch.js**: Sets all specified configs on all of the devices that match the specified search criteria. Useful to bulk apply configurations to a large set of devices.

**cloudxAPI-multiline-example.js** - Example of how to use Cloud xAPI to do a Multiline Command directly to the device using Webex Platform as a proxy
