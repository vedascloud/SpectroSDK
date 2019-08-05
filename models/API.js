var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var APISchema = new Schema({

    DevId : {
        type : String,
        required : true
    } ,

    Proj_Id : {
        type : String,
        required : true
    },

    API_Id : {
        type : String,
        required : true
    },

    API_Name : {
        type : String,
        required : true
    },

    Initial_Count : {
        type : String,
        required : true
    },

    Completed_Count : {
        type : String,
        required : true
    },

    IsEnable : {
        type : Boolean,
        required : false
    }

});

module.exports = mongoose.model("API",APISchema);