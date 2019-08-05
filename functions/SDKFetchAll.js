var SdkDeveloperDB = require('../models/SDKDeveloper');
var SdkAppDB = require('../models/SDKApplication');
var SdkAPIsDB = require('../models/API');
var SdkAPIsListDB = require('../models/APIsList');
var SdkJsonFilesDB = require('../models/sdkJsonFiles');

var SDKMain = {

    //=======================================================Fetch Data for WEB====================================================

    FetchSDKWeb : function (web,callback) {

        SdkDeveloperDB.findOne({DevId : web.DevId}).exec().then(WebDevFound => {

            if (WebDevFound){

                SdkAppDB.find({DevId:web.DevId}).exec().then(WebDevApps => {

                    if (WebDevApps){

                        SdkAppDB.aggregate([
                            {
                                $match: {
                                    DevId: new RegExp(web.DevId, 'i')
                                }
                            },
                            {
                                $lookup: {
                                    from: "sdkandroidapps",
                                    localField: "Project_Id",
                                    foreignField: "Project_Id",
                                    as: "AndroidData"
                                }
                            },
                            {
                                $lookup: {
                                    from: "sdkiosapps",
                                    localField: "Project_Id",
                                    foreignField: "Project_Id",
                                    as: "iOSData"
                                }
                            },
                            {
                                $lookup: {
                                    from: "apis",
                                    localField: "Project_Id",
                                    foreignField: "Proj_Id",
                                    as: "APIsData"
                                }
                            }
                        ]).exec()
                            .then((webData) => {

                                if (webData) {
                                    var r = {
                                        response: '3',
                                        AppsData: webData
                                    };
                                    callback(r);
                                }
                            }).catch((error) => {
                            console.log(error);
                        })

                    }
                    else {
                        callback({response:'1', message:'donot have apps.'})
                    }

                })

            }
            else {
                callback({response : '0' , message : 'no data found.'})
            }

        })

    },


    //======================================================= Fetch API's & JSON-Files Data Using DevId ====================================================

    FetchAPIsAndJsonFilesData : function (devopdata, callback) {

        SdkDeveloperDB.findOne({DevId : devopdata.DevId}).exec().then(DevopFound => {

            if (DevopFound){

                SdkAPIsDB.find({DevId : devopdata.DevId,IsEnable:true}).exec().then(AvailableAPIs => {

                    if (AvailableAPIs){

                        SdkAPIsDB.aggregate([
                                {
                                    $match: {
                                        /*DevId: new RegExp(devopdata.DevId, 'i')*/
                                        IsEnable:true
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "sdkjsonfiles",
                                        localField: "API_Id",
                                        foreignField: "API_Id",
                                        as: "JsonFilesData"
                                    }
                                }
                            ]).exec()
                                .then((FilesData) => {

                                    if (FilesData) {
                                        var r = {
                                            response: '3',
                                            APIsData: FilesData
                                        };
                                        callback(r);
                                    }
                                }).catch((error) => {
                                console.log(error);
                            })

                    }
                    else {
                        callback({response : '1', message : 'dont have APIs'});
                    }

                })

            }
            else {
                callback({response : '0', message : 'no data found.'});
            }

        })

    }



};

module.exports = SDKMain;