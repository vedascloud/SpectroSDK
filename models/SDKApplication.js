var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SDKApplicationSchema = new Schema({

   /* //iOS or Android
    App_Type : {
       type : String,
       required : true
    } ,*/

    DevId : {
        type : String,
        required : true
    } ,

    Project_Id : {
        type : String,
        required : true,
        unique : true
    } ,

    Project_Name : {
        type : String,
        required : true
    }

});

module.exports = mongoose.model('SDKApplication',SDKApplicationSchema);