const Fetch = require("../fetch");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request for AdOps Tool Generate Mutt response from VAST tag');

    const targetURI = (req.query.uri || (req.body && req.body.uri));
    
    // TODO: some URI validation here

    let template;

    targetURI ? template = await Fetch.replaceFromURI(targetURI) : console.error("uri not provided", targetURI);

    const responseMessage = template ? template
        : "Provide a valid vast tag URI as a param, e.g: https://jasonthechiu.com/SESUPPLY-TESTADS/ias-test-dog-vast";
    
    context.res = {
        body: responseMessage,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}