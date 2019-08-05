var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('sdkjsonfiles', new Schema({

        DevId : {
            type : String,
            required : true
        } ,
        id:{
            type:String,
            required:true,
            unique:true
        },
        filename:{
            type:String,
            required:true,
            unique:true
        },
        API_category:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        addedDate:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
        API_Id:{
            type:String,
            required:true
        }

    })
);