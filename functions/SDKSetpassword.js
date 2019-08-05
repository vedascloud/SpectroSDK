var DeveloperDB   = require('../models/SDKDeveloper');
var validator = require('validator');

//==============================Developer Set/Change PWD Function===========================

var Newpassword={

    setpassword:function(userParam,callback){
        var username = userParam.email;
        if(validator.isEmail(username)){
            DeveloperDB.findOne({email:new RegExp(username,'i'),verification_status:true}).exec()
                .then((userStatus) => {
                    console.log(' SDK userStatus..',userStatus);
                    if(userStatus){
                        if(userStatus.password === userParam.password){

                            callback({response:'4',message:'You have already set this password, please enter a new password'});

                        }else{
                            DeveloperDB.updateOne({email:new RegExp(username,'i')},{$set:{password:userParam.password}}).exec()
                                .then((passUpdated) => {
                                    if(passUpdated){

                                        callback({response:'3',message:'The new password has been set successfully, please login again'});

                                    }
                                })
                        }

                    }else{

                        callback({response:'0',message:'You are not a authorized user to set password'});

                    }
                })
        }else{

            callback({response:'0',message:'Pass a valid email address'});

        }
    }
		
};

module.exports=Newpassword;
		