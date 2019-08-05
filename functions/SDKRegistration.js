var nodemailer = require('nodemailer');
var fs = require('fs');

var DeveloperDB   = require('../models/SDKDeveloper');

//==============================Developer Regitration Function===========================

var Add= {

    addDeveloper: function (userParam, callback) {
        let email = userParam.email;
        console.log(email);

            DeveloperDB.findOne({email: new RegExp(email,'i')}).exec()
                .then((userFound) => {
                console.log(' SDK user found...',userFound);
                if(userFound){

                    if(userFound.verification_status === true){

                        var r = {
                            response: '5',
                            message: 'You already have an account with us.'
                        };
                        callback(r);

                    }
                    else {

                        var register_time = Math.floor(Date.now() / 1000);

                        var text = "";
                        var possible = "0123456789";

                        for (var i = 0; i < 4; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }

                        console.log('pin:' + text);

                        //file read starts
                        fs.readFile('./app/configfiles/Register.html', function (err, data) {

                            var str = data.toString();

                            var html = str.replace("%s", text);
                            var html1 = html.replace("%m", email);

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'contact.spectrum.in@gmail.com',
                                    pass: 'vedas2017'
                                }
                            });

                            var mailOptions = {
                                from: 'contact.spectrum.in@gmail.com',
                                to: userParam.email,
                                subject: 'Email Verification',
                                html: html1
                            };

                            DeveloperDB.updateOne({email: new RegExp(email, 'i')}, {
                                $set: {
                                    email:email,
                                    DevId:userFound.DevId,
                                    country:userParam.country,
                                    password: userParam.password,
                                    otp: text,
                                    register_time: register_time,
                                    verification_status: false,
                                    username: userParam.username,
                                    company_name:userParam.company_name,
                                    web_address:userParam.web_address,
                                    company_description:userParam.company_description,
                                    phone_number:userParam.phone_number
                                }
                            }, (error, update) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(update);
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                            callback({response: '0', message: err});
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                    var r = {
                                        response: '3',
                                        message: 'Your registration was successful!'
                                    };
                                    callback(r);
                                }
                            });

                        });
                        //file read ends here
                    }

                }
                else{

                    var register_time = Math.floor(Date.now() / 1000);

                    var DevId = "";
                    var possible = "0123456789";

                    for (var i = 0; i < 6; i++) {
                        DevId += possible.charAt(Math.floor(Math.random() * possible.length));
                    }

                    var text = "";
                    var possible = "0123456789";

                    for (var i = 0; i < 4; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    console.log('pin:' + text);

                    //file read starts
                    fs.readFile('./app/configfiles/Register.html', function (err, data) {

                        var str = data.toString();

                        var html = str.replace("%s", text);
                        var html1 = html.replace("%m", email);

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'contact.spectrum.in@gmail.com',
                                pass: 'vedas2017'
                            }
                        });

                        var mailOptions = {
                            from: 'contact.spectrum.in@gmail.com',
                            to: userParam.email,
                            subject: 'Email Verification',
                            html: html1
                        };

                        var myobj = new DeveloperDB({
                            DevId:"D_"+DevId,
                            country: userParam.country,
                            email:email,
                            username: userParam.username,
                            password: userParam.password,
                            otp: text,
                            register_time: register_time,
                            verification_status: "false",
                            company_name:userParam.company_name,
                            web_address:userParam.web_address,
                            company_description:userParam.company_description,
                            phone_number:userParam.phone_number
                        });

                        myobj.save(function(err){
                            if(err){
                                console.log(err);
                                callback({response:'0',message:err});
                            }else{

                                var r = {response: '3', message: 'Your registration was successful!'};
                                callback(r);
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);

                                    } else {
                                        console.log('Email sent: ' + info.response);

                                    }
                                });

                            }
                        });

                    });
                    //file read ends here
                }

            })
            .catch((error) => {
                    console.log(error);
            })

    }
};

module.exports=Add;