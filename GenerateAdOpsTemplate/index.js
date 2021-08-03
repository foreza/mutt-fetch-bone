const Fetch = require("../fetch");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request for AdOps Tool fetch');

    // TODO: Take in optional param "delim" to replace the default delimiter

    let template = await Fetch.adopsTool();
    context.res = {
        body: template ? template : "Something went wrong.",
        headers: {
            'Content-Type': 'application/json'
        }
    };
}