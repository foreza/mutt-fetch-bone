
var axios = require('axios');           // To quickly make network requests.
var qs = require('qs');                 // For manipulating stuff for axios request body
var fs = require('fs');                 // For file writing


const LOGTAG = "[FETCH BONE TOOL]: ";      // Logging constant

const removeTargetStart = '<?xml';                // The start delim of the VAST in the mutt response
const removeTargetEnd = "VAST>";                  // The end delim of the VAST in the mutt response
const templateDelim = "[replace_target]";         // Macro. Change this to fit whatever is used by adops tool.

var myArgs = process.argv.slice(2);
var command = myArgs[0];


// Utility for logging messages
var logger = (msg) => {
    console.log(LOGTAG + msg);
}


// Do a simple fetch for the provided URI
var getVastXMLFromURI = async function (uri) {
    return axios.get(uri).then((response) => {
        return response.data;
    }).catch((error) => {
        console.error(error);
    })
};


// Function to call Mutt with axios
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


// Function that will write this file
var writeFileJsonResponse = (name, contents) => {
    fs.writeFile(name, contents, function (err) {
        if (err) return console.log(err);
        console.log(`Wrote mutt template to: ${name}`);
    });

}

var makeFileNameWithTimeStamp = (name, ext) => {
    return `${Date.now()}-${name}.${ext}`;
}

var entryPoint = async function(command) {

    switch (command) {
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
            logger("Replacing mutt response with provided XML from URI");
    
            // TODO: why you hard code this?
            
            var xml = await getVastXMLFromURI("https://jasonthechiu.com/SESUPPLY-TESTADS/ias-test-dog-vast");
            
            // TODO: remove white space and double escape dat.

            getMuttResponseForVideo41(
                removeTargetStart,
                removeTargetEnd,
                xml,
                "test");
    
            break;
        default:
            logger("Not supported command. Read the doc.");
    }

}

entryPoint(command);


