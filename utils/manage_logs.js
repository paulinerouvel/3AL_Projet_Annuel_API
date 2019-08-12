const fs = require('fs');

const form_data = require('form-data');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Blob = require('blob');

const request = require('request')


module.exports = {
    generateLogs(err, fileName, functionName){


        let d = new Date(Date.now()).toLocaleString();
        let errScript = "<" + d + ">    API - " + fileName + " at " + functionName + "   " + err + "\n";

        fs.appendFile("wm_api_logs.log", errScript, function(err){
            if(err) throw err
        });


        var req = request.post("http://51.75.143.205:8080/logs/api", function (err, resp, body) {
            if (err) {
              console.log('Error!', err);
            } else {
              console.log('URL: ' + body);
            }
          });

          var form = req.form();

          form.append('file', fs.createReadStream("wm_api_logs.log"));


        req;
    }
}