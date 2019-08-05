var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SDKIOSAppSchema = new Schema({

    Project_Id : {
       type : String,
       required : true,
       unique : true
    } ,

    App_Name : {
        type : String,
        required : true
    } ,

    Bundle_Identifier : {
        type : String,
        required : true
    } ,

    App_Store_Id : {
        type : String
        //required : true
    } ,

    //10 letters (AlphaNumeric)
    App_Key : {
        type : String,
        required : true ,
        unique : true
    } ,

    //16 letters (AlphaNumeric)
    Secret_Key : {
        type : String,
        required : true,
        unique : true
    } ,

    PlistFile: {
        type : String,
        required : true
    } ,

    Created_Date : {
        type : String,
        required : true
    } ,

    Modified_Date : {
        type : String,
        required : true
    }

});

module.exports = mongoose.model("SDKiosApp",SDKIOSAppSchema);