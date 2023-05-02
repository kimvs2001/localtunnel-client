var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.set('useCreateIndex', true);


var subdomainSchema = new Schema({
  
    subdomain: {type:String , required : true ,unique: true},
    clientPort: {type:String},
    date: {type:Date},
    localDate : {type:String},
    fullURL : {type:String},
    
},{ strict: false });

// module.exports = mongoose.model('subdomainData',subdomainSchema);
module.exports = subdomainSchema;