var querystring = require('querystring');
var http = require('http');

var data = JSON.stringify({	
       "type": "email",
       "data": {
         "title": "welcome email for tj",
         "to": "tj@learnboost.com",
         "template": "welcome-email"
       },
     });
console.log(data);
var options = {
    host: 'localhost',
    port: 3000,
    path: '/job',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

for (var index = 0; index < 2000; index++) {
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
    });

    req.write(data);
    req.end();
    console.log("succes" + index);
}