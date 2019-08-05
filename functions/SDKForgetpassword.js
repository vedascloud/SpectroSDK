var DeveloperDB   = require('../models/SDKDeveloper');
//var multiline = require('multiline');
var fs = require('fs');
var nodemailer = require('nodemailer');
var validator = require('validator');

//==============================Developer Forgot PWD Function===========================

var Forgot={

    forgot:function(userParam,callback){
        let username = userParam.email;
        if (validator.isEmail(username)){

            DeveloperDB.findOne({email:new RegExp(username,'i')}).exec()
                .then((userFound) => {
                    console.log(' SDK userfound...',userFound);
                    if(userFound){

                        var updateTime = Math.floor(Date.now() / 1000);

                        let pin = "";
                        var possible = "0123456789";

                        for (var i1 = 0; i1 < 4; i1++){
                            pin += possible.charAt(Math.floor(Math.random() * possible.length));
                        }

                        console.log('pin:'+pin);

                        fs.readFile('./app/configfiles/Forgetpassword.html', function (err, data) {

                            var str = data.toString();

                            var html = str.replace("%s", pin);
                            var html1 = html.replace("%m",username);

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'contact.spectrum.in@gmail.com',
                                    pass: 'vedas2017'
                                }
                            });

                            var mailOptions = {
                                from: 'contact.spectrum.in@gmail.com',
                                to: username,
                                subject: 'Forgot password OTP verification',
                                html: html1
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    callback({response: '0', message: err});
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });

                            DeveloperDB.updateOne({email:new RegExp(username,'i')},{$set:{otp:pin,register_time:updateTime,verification_status:false}}).exec()
                                .then((otpUpdated) => {
                                    console.log('otp updated...',otpUpdated);
                                    if(otpUpdated){
                                        callback({response:'3',message:'Please verify your account'});
                                    }else{
                                        callback({response:'0',message:'Something went wrong'});
                                    }
                                })

                        });

                    }else{
                        callback({response:'0',message:'you dont have account please register'});
                    }
                })

        }else{
            console.log('please pass correct email address');
            callback({response:'0',message:'we have not yet provide the option to use mobile number.'});
        }
    }
		
};

module.exports=Forgot;

		