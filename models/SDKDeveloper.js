var config = require('../app/configfiles/config.json');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var SDKDeveloperSchema = new Schema({

    DevId: {
        type : String,
        required : true,
        unique : true
    },
    country: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        index : true,
        unique : true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    verification_status:{
        type:Boolean,
        default:false,
        required:true
    },
    username: {
        type:String,
        required:true
    },
    company_name: {
        type:String,
        required:true
    },
    web_address:{
        type:String,
        required:true
    },
    company_description: {
        type:String
    },
    register_time:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    }

});

mongoose.connect(config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

module.exports = mongoose.model('SDKDeveloper',SDKDeveloperSchema);