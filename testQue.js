var kue = require('kue')
, queue = kue.createQueue();
express = require("express")
var sendMail = require('./SendMail.js');
fs = require('fs');
var emailSender =0;
var emails = [{user: 'kiosagro2016@gmail.com', // Your email id
                pass: 'P4ssw0rd-1' // Your password
                },
                {user: 'albaipro@gmail.com', // Your email id
                pass: 'programeralbai' // Your password
                },
                {user: 'electricaldizzy@gmail.com', // Your email id
                pass: 'programerjualan' // Your password
                },
                {user :"albai.developer@gmail.com",
                pass:"programer"},
                {user :"albaifind@gmail.com",
                pass:"programeralbai"},
				];

var dateNow = new Date();
dateNow =dateNow.setDate(dateNow.getMinutes()-1);

kue.Job.rangeByState('complete', 0, 10, 3, function(err, jobs) {
  jobs.forEach(function(job) {
    
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});

queue.process('email', 2, function(job, done){
    
     email(job, done);
    job.on('complete', function(result){
        console.log('Job completed with data ', result);
    }).on('failed attempt', function(errorMessage, doneAttempts){
        console.log('Job failed');
    })
});


queue.process('cek-kupon', 2, function(job, done){
    
     email(job, done);
    job.on('complete', function(result){
        console.log('Job completed with data ', result);
    }).on('failed attempt', function(errorMessage, doneAttempts){
        console.log('Job failed');
    })
});


function email(job, done) {
  // email send stuff...
  sendMail.SendEmail(job, emails[emailSender], function(job){
      console.log("done");
      console.log(emails[emailSender]);
     done(); 
  }, function(job){
      console.log("job failed");
      if(emailSender == 4)
      {
        emailSender =0;
      }
      else
      {
        emailSender++;
      }
      done(job);
  });
}

queue.on('job enqueue', function(id, type){
  console.log( 'Job %s got queued of type %s', id, type );

}).on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    if (err) return;
  });
});


kue.app.listen(3000);
console.log("Listen 3100");