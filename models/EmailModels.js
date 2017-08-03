var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/ScrapAgromaret_2');
var Email = new mongoose.Schema({
    name :{
        type:String,
        index : true,
        require : true
    },
    email : {
        type:String
    }, 
    fgpromote : {
        type:Boolean
    }
});


Email.plugin(require("mongoose-timestamp"));
var EmailModel = mongoose.model("Email", Email);
module.exports = EmailModel;