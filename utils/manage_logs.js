const fs = require('fs');

module.exports = {
    generateLogs(err, fileName, functionName){

        let d = new Date(Date.now()).toLocaleString();
        let errScript = "<" + d + ">    API - " + fileName + " at " + functionName + "   " + err + "\n";


        fs.appendFile("wm_api_logs.log", errScript, function(err){
            if(err) throw err
        });
    }
}