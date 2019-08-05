var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var APIsListSchema = new Schema({

    API_Id : {
        type : String,
        required : true,
        unique : true
    },

    API_Name : {
        type : String,
        required : true
    },

    Category : {
        type : String,
        required : true
    },

    API_For : {
        type : String,
        required : true
    },

    API_Description : {
        type : String,
        required : true
    }

});

module.exports = mongoose.model("APIsList",APIsListSchema);