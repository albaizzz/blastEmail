var querystring = require('querystring');
var http = require('http');
var emails = require("./models/EmailModels");

var mongoConnectionString = "mongodb://127.0.0.1/agenda";
Agenda = require('agenda');
var agenda = new Agenda({db: {address: mongoConnectionString}});

// or override the default collection name:
// var agenda = new Agenda({db: {address: mongoConnectionString, collection: "jobCollectionName"}});

// or pass additional connection options:
// var agenda = new Agenda({db: {address: mongoConnectionString, collection: "jobCollectionName", options: {server:{auto_reconnect:true}}});

// or pass in an existing mongodb-native MongoClient instance
// var agenda = new Agenda({mongo: myMongoClient});

agenda.define('blast', function(job, done) {
 console.log("Agenda running");
emails.find({fgpromote:false}, function(err,data){
    if(err)
    {
        console.log(err);
    }
    else{
        data.forEach(function(element) {
            var data = JSON.stringify({	
                   "type": "email",
                   "data": {
                     "name": element.name ,
                     "email": element.email,
                   },
                   "options" : {
                     "attempts": 5,
                     "delay": 1000,
                     "priority": "high"
                   }
                 });
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

            for (var index = 0; index < 1; index++) {
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
            
            var dataEmail = emails.findById(element._id, function(err, dataEmail){
                dataEmail.fgpromote = true;
                dataEmail.save();
            });
            console.log(element.name);
        }, this);
    }
}).limit(10);

 done();
});

agenda.on('ready', function() {
  agenda.every('15 seconds', 'blast');

//   // Alternatively, you could also do:
//   agenda.every('*/3 * * * *', 'delete old users');

  agenda.start();
});
