// TODO: Figure out what to do with this.

const fs = require('fs');                                 // For file writing
const chalk = require("chalk");                         
const boxen = require("boxen");
const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#555555"
};

const LOGTAG = "[FETCH BONE TOOL]: ";                     // Logging constant


// Utility for logging pretty messages if we are running this locally.
var logger = (msg) => {
    const greeting = chalk.white.bold(LOGTAG + msg);
    const msgBox = boxen( greeting, boxenOptions );
    console.log(msgBox);
}



// Given a file name and the contents of that file, write it to output
// Returns a status message indicating whether the write succeeded
var writeFileJsonResponse = (name, contents) => {
    fs.writeFile("./output/" + name, contents, function (err) {
        if (err) {
            return console.log(err);
        }
        
        return logger(`Wrote mutt template to: ${name}`);
    });

}


// Given the file name with the extension, append the current time/date
// Accepts the name and the extension (can be anything presently)
// Returns a uniquified filename
var makeFileNameWithTimeStamp = (name, ext) => {
    return `${Date.now()}-${name}.${ext}`;
}