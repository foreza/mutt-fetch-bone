const axios = require('axios');                           // To quickly make network requests.
const qs = require('qs');                                 // For manipulating stuff for axios request body
const fs = require('fs');                                 // For file writing

const LOGTAG = "[FETCH BONE TOOL]: ";                     // Logging constant
const removeTargetStart = '<?xml';                        // The start delim of the VAST in the mutt response
const removeTargetEnd = "VAST>";                          // The end delim of the VAST in the mutt response
const templateDelim = "$REPLACE_VAST_TARGET";             // Macro. Change this to fit whatever is used by adops tool.

const myArgs = process.argv.slice(2);

// Utility for logging messages
var logger = (msg) => {
    console.log(LOGTAG + msg);
}


// Function that will fetch content at the provided URI
// Requires the URI
// Returns a promise (must await this)
var getVastXMLFromURI = async function (uri) {
    return axios.get(uri).then((response) => {
        return response.data;
    }).catch((error) => {
        console.error(error);
    })
};


// Function to call Mutt with axios
// Requires the start/end of the payload (usually the leading tags of a VAST), the intended replacement, and a file name
// Returns a boolean indicating whether there were errors with the remote fetch
var getMuttResponseForVideo41 = (targetStart, targetEnd, replacement, outputName) => {

    /* Mutt request params for axios */

    // Body for Mutt Request
    // TODO: Read in these params ideally from a file.
    var muttBodyData = qs.stringify({
        'u-s-id': '534A45969C9E4FCD99155EECDFACE75E',
        'u-appbid': 'BadBoyBob',
        'client-request-id': '99999999-cccc-4444-bbbb-ffffffffffff',
        'as-plid': '380003',
        'd-nettype-raw': 'wifi',
        'd-device-screen-size': '1030x600',
        'has-dynamic-mediation': '0',
        'd-language': 'en-US',
        'u-appdnm': 'InMobiCheeseTart',
        'int-origin': 'as',
        'adtype': 'int',
        'loc-consent-status': 'False',
        'd-orientation': '3',
        'format': 'unifiedSdkJson',
        'd-localization': 'en-US',
        'd-device-screen-density': '1',
        'u-id-adt': '0',
        'u-appver': '1.1.2',
        'u-rt': '0',
        'mk-ads': '1',
        'consentObject': '{"gdpr_consent_available":false,"gdpr":0}',
        'd-density-dependent-screen-size': '1030x600',
        'u-id-map': '{"WIDA": "22844e0855afca4608ac8929aa629976e9"}',
        'mk-version': 'pr-SWIN-0.7.1-20210404',
        'tz': '-25200000',
        'im-ext': '{"coppa": false, "pubGdprDpaSigned": true, "applyGdprAgeOfConsent": false}',
        'as-ext': '{"coppa": false, "pubGdprDpaSigned": true,"applyGdprAgeOfConsent": false}'
    });

    // Config for Mutt Request
    var muttReqConfig = {
        method: 'post',
        url: 'https://ads.inmobi.com/sdk',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-forwarded-for': '71.190.79.14',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko)'
        },
        data: muttBodyData
    };

    axios(muttReqConfig).then((response) => {

        var adResponse = response.data;

        // Get the ad pubcontent from the remote.
        var adPubContentString = adResponse.adSets[0].ads[0].pubContent;

        // Set the response payload to this. Congrats. 
        adResponse.adSets[0].ads[0].pubContent = replaceAdPayloadWithContent(
            targetStart, targetEnd, adPubContentString, replacement);

        // Write this to file.
        writeFileJsonResponse(
            makeFileNameWithTimeStamp(outputName, "json"),
            JSON.stringify(adResponse));

    }).catch((error) => {
        console.log(error);
        return false;
    });

}


// Replaces the provided ad payload with the macro given a start/end delim
// Returns the modified payload.
var replaceAdPayloadWithContent = (start, end, payload, content) => {

    var indexForStart = payload.indexOf(start);
    var indexForEnd = payload.indexOf(end);

    // console.log(`start index ${indexForStart} end index ${indexForEnd}`);
    var payloadFront = payload.substring(0, indexForStart);
    var payloadEnd = payload.substring(indexForEnd + end.length);
    var retPayload = payloadFront + content + payloadEnd;

    return retPayload;
}

// Given an XML body, strip whitespace and line breaks, then escape it
// Returns the modified xml to be placed in the Mutt response
var prepareXMLPayloadForInsertion = (xml) => {

    // Remove all line breaks
    /*
        - Thanks, https://www.textfixer.com/tutorials/javascript-line-breaks.php
        - Removes 3 types of line breaks. new line, carriage return, carriage return with new line
        - Applies to all lines (/m) globally (/g)
    */
    var regex = new RegExp(/(\r\n|\n|\r)/gm);
    xml = xml.replace(regex, "");

    // Clean up any cases where we have more than one space and make it just one space.
    // regex = new RegExp(/(\s\s+)/gm);
    // xml = xml.replace(regex, " ").trim();

    // Double escape, and then trim off the leading quotes
    xml = JSON.stringify(xml);
    xml = xml.substring(1, xml.length - 1);

    // Log the sample to the console so we can examine it
    logger("Sample start: " + xml.substring(0, 200));
    logger("Sample end: " + xml.substring(xml.length - 200));
    return xml;
}


// Given a file name and the contents of that file, write it to output
// Returns a status message indicating whether the write succeeded
var writeFileJsonResponse = (name, contents) => {
    fs.writeFile("./output/" + name, contents, function (err) {
        if (err) {
            return console.log(err);
        }
        return console.log(`Wrote mutt template to: ${name}`);
    });

}

// Given the file name with the extension, append the current time/date
// Accepts the name and the extension (can be anything presently)
// Returns a uniquified filename
var makeFileNameWithTimeStamp = (name, ext) => {
    return `${Date.now()}-${name}.${ext}`;
}

// Application entry point
// Provide an array of commands e.g ["adops", "blah"]
var entryPoint = async function (commandArr) {

    switch (commandArr[0]) {
        case 'adops':
            logger("Fetching adops template.");

            // Invoke function for simple replacement. 
            getMuttResponseForVideo41(
                removeTargetStart,
                removeTargetEnd,
                templateDelim,
                "adops");
            break;
        case 'replaceFromURI':

            // We need the target URI as the next param
            if (!commandArr[1]) {
                console.error("No argument provided here - please provide the URI to request")
                break;
            }

            var targetURI = commandArr[1];
            logger("Replacing mutt response with provided XML from URI: " + targetURI);

            var xml = await getVastXMLFromURI(targetURI);

            xml = prepareXMLPayloadForInsertion(xml);
            getMuttResponseForVideo41(
                removeTargetStart,
                removeTargetEnd,
                xml,
                "replaced");

            break;
        default:
            logger("Not supported commandArr. Read the doc.");
    }

}

entryPoint(myArgs);