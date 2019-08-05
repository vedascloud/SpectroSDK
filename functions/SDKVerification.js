var validator = require('validator');
var DeveloperDB   = require('../models/SDKDeveloper');

//==============================Developer Verification Function===========================

var Verify={

    verifyDeveloper:function(userParam,callback){
        console.log(userParam);
        var email = userParam.email;

        if(validator.isEmail(email)){

            DeveloperDB.findOne({email:new RegExp(email,'i')}).exec()
                .then((userInfo) => {
                    console.log(' SDK userInfo...',userInfo);
                    if(userInfo === null){
                        callback({response:'0',message:'no user found to verify'});
                    }else if(typeof userInfo !== undefined){

                        if(userParam.otp === userInfo.otp){

                            var attempt_time = Math.floor(Date.now() / 1000);

                            let at = attempt_time;
                            let t = at-userInfo.register_time;

                            if(t<=118330.5 && t>=0){

                                DeveloperDB.updateOne({email:email},{$set:{verification_status:true}}).exec()
                                    .then((userSuccess) => {
                                        console.log('user success verified..',userSuccess);

                                        if (userParam.from === 'web') {

                                            console.log('logged in from web ...');

                                        }else{
                                            console.log('logged in from mobile device...');

                                        }
                                        var r = {response:'3',message:'Your account has been successfully verified'};
                                        callback(r);

                                    })
                                    .catch((error)=>{
                                        callback({response:'0',message:error});
                                    })

                            }else{
                                var r1 = {response:'1',message:'Your OTP got expired'};
                                callback(r1);
                            }
                        }else{
                            var r2 = {response:'0',message:'Invalid OTP'};
                            callback(r2);
                        }
                    }
                })
        }
        else{
            console.log('Invalid mail!!');
            callback({response:'0',message:'Invalid email address'});
        }
    }
};

module.exports=Verify;
