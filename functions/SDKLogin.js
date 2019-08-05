var DeveloperDb = require('../models/SDKDeveloper');
var ApplicationDb = require('../models/SDKApplication');

var validator = require('validator');

const opts = {
    errorEventName: 'error',
    logDirectory: './mylogfiles', // NOTE: folder must exist and be writable...
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};

const log = require('simple-node-logger').createRollingFileLogger(opts);

//==============================Developer Login Function===========================

var Login = {

    loginAuthentication: (userParam, callback) => {

        const username1 = userParam.email;

        console.log('SDK username...',userParam.email);
        console.log('SDK password...',userParam.password);

        if (validator.isEmail(username1)) {

            DeveloperDb.findOne({email: new RegExp(username1, 'i')}).exec()
                .then((userFound) => {

                    if (userFound) {

                        DeveloperDb.findOne({email: new RegExp(username1, 'i'),verification_status:true}).exec()
                            .then((userFound) => {

                                if (userFound) {

                                    if (userFound.password === userParam.password) {

                                        DeveloperDb.findOne({email: new RegExp(username1, 'i')},{_id:false,__v:false}).exec()
                                            .then((DevFound) => {

                                                if (DevFound){

                                                    ApplicationDb.find({DevId:DevFound.DevId},{_id:false,__v:false,Created_Date:false,Modified_Date:false}).exec().then((AppData) => {

                                                        if (AppData){
                                                            callback({response:'3',DeveloperData:DevFound,AppsData:AppData});
                                                        }
                                                        else {
                                                            callback({response:'0', message:'something went wrong!!!'});
                                                        }

                                                    }).catch((Error) => {

                                                        log.info('device insertion status', error, ' accepted at ', new Date().toJSON());
                                                        throw Error;
                                                    })

                                                    //callback({response:'3',DeveloperData:DevFound});

                                                }
                                                else {
                                                    callback({response:'0', message:'something went wrong!!!'});
                                                }
                                            })
                                            .catch((Error) => {

                                                log.info('device insertion status', error, ' accepted at ', new Date().toJSON());
                                                throw Error;
                                            })


                                    } else {

                                        var r1 = {response: '0', message: 'The username or password is incorrect'};
                                        callback(r1);
                                    }

                                }
                                else {
                                    callback({response:'0', message:'please verify your account.'});

                                }

                            });


                        //
                    } else {

                        callback({response: '2', message: 'No data found. Please register with us'});

                    }

                })
                .catch((error) => {
                    log.info('device insertion status', error, ' accepted at ', new Date().toJSON());

                })

        }
        else {
            callback({ response: '0', message: 'Please pass a valid email address' });
        }
    }
};
module.exports = Login;
