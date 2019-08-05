var plist = require('simple-plist');
var fs = require('file-system');
const jsonfile = require('jsonfile')

var DeveloperDB = require('../models/SDKDeveloper');
var ApplicationDB = require('../models/SDKApplication');
var IOSAppDB = require('../models/SDKiosApp');
var AndroidAppDB = require('../models/SDKAndroidApp');

var Application = {

    //===========================================Check & Add Application Data ======================================================

    CheckApplication : function (checkData,callback) {

        DeveloperDB.findOne({DevId:checkData.DevId}).exec().then((DevFound)=>{

            if (DevFound){

                ApplicationDB.findOne({Project_Name:checkData.Project_Name}).exec().then((ProjectFound)=>{

                    if (ProjectFound){
                        callback({response : '0', message : 'Project is Available.'});
                    }
                    else {

                        ApplicationDB.findOne({Project_Id: checkData.Project_Id}).exec().then((ProjectIdFound) => {

                            if (ProjectIdFound) {
                                callback({response: '0', message: 'Project_Id is Used.'});
                            }

                            else {

                                var Created_Date = Math.floor(Date.now() / 1000);

                                var Modified_Date = Math.floor(Date.now() / 1000);

                                var newObj = new ApplicationDB({

                                    DevId: DevFound.DevId,
                                    Project_Id: checkData.Project_Id,
                                    Project_Name: checkData.Project_Name,
                                    Created_Date: Created_Date,
                                    Modified_Date: Modified_Date

                                });

                                newObj.save(function (err) {

                                    if (err) {
                                        console.log(err);
                                        callback({response: '0', message: err});
                                    }
                                    else {

                                        callback({response: '3', message: "App Added Successfully."});

                                    }

                                });

                            }

                        }).catch((error) => {
                            console.log(error);
                        })
                    }

                }).catch((error) => {
                    console.log(error);
                })
            }
            else {
                callback({response : '0', message : 'Invalid Developer.'});
            }

        }).catch((error) => {
            console.log(error);
        })

    },

    //===========================================Add IOS Application Data ==========================================================

    AddCheckedIOSApplication : function (iosData,callback) {

        DeveloperDB.findOne({DevId:iosData.DevId}).exec().then((DevFound)=>{

            if (DevFound) {

                ApplicationDB.findOne({
                    Project_Id:iosData.Project_Id
                }).exec().then((ProjectFound) => {

                    if (ProjectFound) {

                        IOSAppDB.findOne({Project_Id:iosData.Project_Id}).exec().then((ProjIdFound)=>{
                            if (ProjIdFound){

                                callback({response: '0', message: 'Project_Id is Used.'});

                            }
                            else {

                                IOSAppDB.findOne({Bundle_Identifier: iosData.Bundle_Identifier}).exec().then((BundleIdFound) => {

                                    if (BundleIdFound) {
                                        callback({response: '0', message: 'Bundle_Identifier is Used.'});
                                    }
                                    else {

                                        var Created_Date = Math.floor(Date.now() / 1000);

                                        var Modified_Date = Math.floor(Date.now() / 1000);

                                        var App_Key1 = "";
                                        var possible1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                        for (var i = 0; i < 10; i++) {
                                            App_Key1 += possible1.charAt(Math.floor(Math.random() * possible1.length));
                                        }

                                        var Secret_Key1 = "";
                                        var possible11 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                        for (var i = 0; i < 16; i++) {
                                            Secret_Key1 += possible11.charAt(Math.floor(Math.random() * possible11.length));
                                        }

                                        var BundleId = iosData.Bundle_Identifier;
                                        var AppName = iosData.App_Name;
                                        var AppKey = App_Key1;
                                        var SecretKey = Secret_Key1;
                                        var AppStroreId = iosData.App_Store_Id;

                                        var xml =
                                            '<?xml version="1.0" encoding="UTF-8"?>' +
                                            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' +
                                            '<plist version="1.0">' +
                                            '<key>metadata</key>' +
                                            '<dict>' +
                                            '<key>bundle-identifier</key>' +
                                            '<string>%B</string>' +
                                            '<key>AppName</key>' +
                                            '<string>%A</string>' +
                                            '<key>AppKey</key>' +
                                            '<string>%AK</string>' +
                                            '<key>SecretKey</key>' +
                                            '<string>%SK</string>' +
                                            '<key>AppStoreId</key>' +
                                            '<string>%aId</string>' +
                                            '</dict>' +
                                            '</plist>';

                                        var xml1 = xml.replace("%B", BundleId);
                                        var xml2 = xml1.replace("%A", AppName);
                                        var xml3 = xml2.replace("%AK", AppKey);
                                        var xml4 = xml3.replace("%SK", SecretKey);
                                        var xml5 = xml4.replace("%aId", AppStroreId);

                                        var data = plist.parse(xml5);

                                        //var path = "./public/plistFiles/" + AppName + ".plist";

                                        var path = "./ConfiguredFiles/" + AppName + ".plist";

                                        plist.writeFile(path, data, function (err) {
                                            if (err) {
                                                throw err;
                                            }
                                            console.log('file created');
                                        });

                                        var newIOS = new IOSAppDB({

                                            App_Name: iosData.App_Name,
                                            Bundle_Identifier: iosData.Bundle_Identifier,
                                            App_Store_Id: iosData.App_Store_Id,
                                            App_Key: App_Key1,
                                            Secret_Key: Secret_Key1,
                                            Project_Id: iosData.Project_Id,
                                            //PlistFile: "localhost:8097" + "/plistFiles/" + AppName + ".plist",
                                            //PlistFile: "14.98.168.118" + "/plistFiles/" + AppName + ".plist",
                                            //PlistFile: "localhost:8097" + "/ConfiguredFiles/download/" + AppName + ".plist",
                                            PlistFile: "https://sdk.vedascloud.com" + "/ConfiguredFiles/download/" + AppName + ".plist",
                                            //http://54.210.61.0/ConfiguredFiles/download/admin.json
                                            Created_Date:Created_Date,
                                            Modified_Date:Modified_Date

                                        });

                                        newIOS.save(function (err) {

                                            if (err) {

                                                console.log(err);
                                                callback({response: '0', message: err});

                                            }
                                            else {

                                                var r = {response: '3', message: 'Your App was Added.'};
                                                callback(r);

                                            }

                                        });

                                    }

                                });


                            }
                        })

                    }
                    else {

                        callback({response:'0',message:'Invalid Project_Id.'});

                    }

                }).catch((error) => {
                    console.log(error);
                })

            }
            else {
                callback({response : '0', message : 'Invalid Developer.'});
            }

        }).catch((error) => {
            console.log(error);
        })

    },

    //=========================================Add Android Application Data ========================================================

    AddCheckedAndroidApplication : function (AndroidData,callback) {

        DeveloperDB.findOne({DevId:AndroidData.DevId}).exec().then((DevFound)=>{

            if (DevFound) {

                ApplicationDB.findOne({
                    Project_Id:AndroidData.Project_Id
                }).exec().then((ProjectFound) => {

                    if (ProjectFound) {

                        AndroidAppDB.findOne({Project_Id:AndroidData.Project_Id}).exec().then((ProjIdFound)=>{
                            if (ProjIdFound){

                                callback({response: '0', message: 'Project_Id is Used.'});

                            }
                            else {

                                AndroidAppDB.findOne({Package_Name: AndroidData.Package_Name}).exec().then((PackageFound) => {

                                    if (PackageFound) {
                                        callback({response: '0', message: 'Package_Name is Used.'});
                                    }
                                    else {

                                        var Created_Date = Math.floor(Date.now() / 1000);

                                        var Modified_Date = Math.floor(Date.now() / 1000);

                                        var App_Key3 = "";
                                        var possible3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                        for (var i = 0; i < 10; i++) {
                                            App_Key3 += possible3.charAt(Math.floor(Math.random() * possible3.length));
                                        }

                                        var Secret_Key3 = "";
                                        var possible33 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                        for (var i = 0; i < 16; i++) {
                                            Secret_Key3 += possible33.charAt(Math.floor(Math.random() * possible33.length));
                                        }

                                        var PackageName = AndroidData.Package_Name;
                                        var AppName11 = AndroidData.App_Name;
                                        var AppKey11 = App_Key3;
                                        var SecretKey11 = Secret_Key3;
                                        var PlayStoreLink = AndroidData.PlayStore_Link;

                                        const file = "./ConfiguredFiles/" + AppName11 + ".json";

                                        const obj = {

                                            Package_Name:PackageName,
                                            App_Name:AppName11,
                                            App_Key:AppKey11,
                                            Secret_Key:SecretKey11,
                                            PlayStore_Link:PlayStoreLink

                                        }

                                        jsonfile.writeFile(file, obj)
                                            .then(res => {
                                                console.log('File Created.')
                                            })
                                            .catch(error => console.error(error));

                                        var newAndroid = new AndroidAppDB({

                                            App_Name: AndroidData.App_Name,
                                            Package_Name: AndroidData.Package_Name,
                                            PlayStore_Link: AndroidData.PlayStore_Link,
                                            App_Key: App_Key3,
                                            Secret_Key: Secret_Key3,
                                            Project_Id:AndroidData.Project_Id,
                                            Created_Date:Created_Date,
                                            Modified_Date:Modified_Date,
                                            //JSONFile:"localhost:8097"+"/jsonFiles/"+ AppName11 + ".json"
                                            //AndroidJsonFiles:"14.98.168.118"+"/AndroidJsonFiles/"+ AppName11 + ".json"
                                            //AndroidJsonFiles:"localhost:8097"+"/ConfiguredFiles/download/"+ AppName11 + ".json"
                                            AndroidJsonFiles:"https://sdk.vedascloud.com"+"/ConfiguredFiles/download/"+ AppName11 + ".json"

                                        });

                                        newAndroid.save(function (err) {

                                            if (err) {

                                                console.log(err);
                                                callback({response: '0', message: err});

                                            }
                                            else {

                                                var r = {response: '3', message: 'Your App was Added.'};
                                                callback(r);

                                            }

                                        });

                                    }

                                });


                            }
                        })

                    }
                    else {

                        callback({response:'0',message:'Invalid Project_Id.'});

                    }

                }).catch((error) => {
                    console.log(error);
                })

            }
            else {
                callback({response : '0', message : 'Invalid Developer.'});
            }

        }).catch((error) => {
            console.log(error);
        })

    },

    //===========================================Update IOS Application Data =======================================================

    UpdateIOSApplication : function(updatedata,callback){

        DeveloperDB.findOne({DevId:updatedata.DevId}).exec().then((devFound) => {

            console.log(" Developer Found. ");

            if (devFound){

                ApplicationDB.findOne({DevId:updatedata.DevId,Project_Id:updatedata.Project_Id}).exec().then((AppFound) =>{

                    var Modified_Date = Math.floor(Date.now() / 1000);

                    if (AppFound) {

                        IOSAppDB.findOne({Project_Id: updatedata.Project_Id}).exec().then((isFound)=>{

                            if (isFound){

                                //

                                var filePath = "./ConfiguredFiles/" + isFound.App_Name + ".plist";

                                var BundleId = updatedata.Bundle_Identifier;
                                var AppName = updatedata.App_Name;
                                var AppKey = isFound.App_Key;
                                var SecretKey = isFound.Secret_Key;
                                var AppStroreId = updatedata.App_Store_Id;

                                var xml =
                                    '<?xml version="1.0" encoding="UTF-8"?>' +
                                    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' +
                                    '<plist version="1.0">' +
                                    '<key>metadata</key>' +
                                    '<dict>' +
                                    '<key>bundle-identifier</key>' +
                                    '<string>%B</string>' +
                                    '<key>AppName</key>' +
                                    '<string>%A</string>' +
                                    '<key>AppKey</key>' +
                                    '<string>%AK</string>' +
                                    '<key>SecretKey</key>' +
                                    '<string>%SK</string>' +
                                    '<key>AppStoreId</key>' +
                                    '<string>%aId</string>' +
                                    '</dict>' +
                                    '</plist>';

                                var xml1 = xml.replace("%B", BundleId);
                                var xml2 = xml1.replace("%A", AppName);
                                var xml3 = xml2.replace("%AK", AppKey);
                                var xml4 = xml3.replace("%SK", SecretKey);
                                var xml5 = xml4.replace("%aId", AppStroreId);

                                var data = plist.parse(xml5);

                                var pathToDelete = filePath;
                                fs.unlink(pathToDelete, function (err) {
                                    if (err) throw err;
                                    console.log('File deleted!');
                                });

                                var path = "./ConfiguredFiles/" + AppName + ".plist";

                                plist.writeFile(path, data, function (err) {

                                    if (err) {
                                        throw err;
                                    }
                                    console.log('file updated');
                                });

                                //

                                IOSAppDB.updateOne({Project_Id: updatedata.Project_Id}, {
                                    $set: {

                                        App_Name: updatedata.App_Name,
                                        Bundle_Identifier: updatedata.Bundle_Identifier,
                                        App_Store_Id: updatedata.App_Store_Id,
                                        Modified_Date: Modified_Date,
                                        PlistFile: "https://sdk.vedascloud.com" + "/ConfiguredFiles/download/" + updatedata.App_Name + ".plist",

                                    }
                                }).exec().then((AppUpdated) => {
                                    if (AppUpdated) {
                                        callback({response: '3', message: 'Your App successfully updated.'});
                                    }
                                    else {
                                        callback({response: '0', message: 'Your App not updated.'});
                                    }

                                }).catch((error) => {
                                    console.log(error);
                                })

                            }
                            else {
                                callback({response: '0', message: 'Your App not updated.'});
                            }

                        }).catch((error) => {
                            console.log(error);
                        })

                    }
                    else {

                        callback({response: '0', message: 'Your App not updated.'});

                    }

                }).catch((error) => {
                    console.log(error);
                })

            }
            else {

                callback({response : '0', message : " Invalid Developer. "});

            }

        })


    },

    //===========================================Update Android Application Data ===================================================

    UpdateAndroidApplication : function(updatedata,callback){

        DeveloperDB.findOne({DevId:updatedata.DevId}).exec().then((devFound) => {

            console.log(" Developer Found. ");

            if (devFound){

                ApplicationDB.findOne({DevId:updatedata.DevId,Project_Id:updatedata.Project_Id}).exec().then((AppFound) =>{

                    var Modified_Date = Math.floor(Date.now() / 1000);

                    if (AppFound) {

                        AndroidAppDB.findOne({Project_Id: updatedata.Project_Id}).exec().then((isFound)=>{

                            if (isFound){

                                //

                                var filePath = "./ConfiguredFiles/" + isFound.App_Name + ".json";

                                var PackageName = updatedata.Package_Name;
                                var AppName11 = updatedata.App_Name;
                                var AppKey11 = isFound.App_Key;
                                var SecretKey11 = isFound.Secret_Key;
                                var PlayStoreLink = updatedata.PlayStore_Link;

                                const file = "./ConfiguredFiles/" + AppName11 + ".json";

                                const obj = {

                                    Package_Name:PackageName,
                                    App_Name:AppName11,
                                    App_Key:AppKey11,
                                    Secret_Key:SecretKey11,
                                    PlayStore_Link:PlayStoreLink

                                }

                                var pathToDelete = filePath;
                                fs.unlink(pathToDelete, function (err) {
                                    if (err) throw err;
                                    console.log('File deleted!');
                                });

                                var path = "./ConfiguredFiles/" + AppName11 + ".json";

                                jsonfile.writeFile(path, obj, function (err) {
                                    if (err) throw err;
                                    console.log('File Updated.');
                                });

                                AndroidAppDB.updateOne({Project_Id: updatedata.Project_Id}, {
                                    $set: {

                                        App_Name: updatedata.App_Name,
                                        Package_Name: updatedata.Package_Name,
                                        PlayStore_Link: updatedata.PlayStore_Link,
                                        Modified_Date: Modified_Date,
                                        AndroidJsonFiles:"https://sdk.vedascloud.com"+"/ConfiguredFiles/download/"+ updatedata.App_Name + ".json"


                                    }
                                }).exec().then((AppUpdated) => {
                                    if (AppUpdated) {
                                        callback({response: '3', message: 'Your App successfully updated.'});
                                    } else {
                                        callback({response: '0', message: 'Your App not updated.'});
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                })

                            }
                            else {
                                callback({response: '0', message: 'Your App not updated.'});
                            }

                        }).catch((error) => {
                            console.log(error);
                        })

                    }
                    else {

                        callback({response: '0', message: 'Your App not updated.'});

                    }

                }).catch((error) => {
                    console.log(error);
                })

            }else {

                callback({response : '0', message : " Invalid Developer. "});

            }

        })

    },

    //===========================================Fetch Applications Data Using GET==================================================

    GetApplication : function (userid,callback) {
        ApplicationDB.find({DevId:userid},{_id:0,__v:0}).exec()
            .then((results) => {
                console.log("From Model : "+userid);
                //console.log('results...',results);

                ApplicationDB.aggregate([
                    {
                        $match: {
                            DevId: userid
                        }
                    },
                    {
                        $lookup: {
                            from: "sdkiosapps",
                            localField: "Project_Id",
                            foreignField: "Project_Id",
                            as: "iOS"
                        }
                    },
                    {
                        $lookup: {
                            from: "sdkandroidapps",
                            localField: "Project_Id",
                            foreignField: "Project_Id",
                            as: "Android"
                        }
                    }
                ]).exec()
                    .then((hreservData) => {

                        if (hreservData) {
                            var r = {
                                response: '3',
                                Applications: hreservData
                            };
                            callback(r);
                        }
                    }).catch((error) => {
                    console.log(error);
                })

            })
    },

    //===========================================Delete Application Data ===========================================================

    DeleteApplication : function (deleteData,callback) {

        DeveloperDB.findOne({DevId:deleteData.DevId},{_id:false,__v:false}).exec().then((results)=> {

            console.log("Delete Req Data : ",deleteData);

            if (results) {

                ApplicationDB.findOne({Project_Id:deleteData.Project_Id}).exec().then((fileFound)=>{

                    if (fileFound) {

                        ApplicationDB.deleteOne({Project_Id: deleteData.Project_Id}).exec().then((res) => {
                            if (res) {

                                IOSAppDB.findOne({Project_Id: deleteData.Project_Id}).exec().then((fileFound) => {

                                    if (fileFound) {

                                        IOSAppDB.deleteOne({Project_Id: deleteData.Project_Id}).exec().then((res) => {
                                            if (res) {

                                                AndroidAppDB.findOne({Project_Id: deleteData.Project_Id}).exec().then((AndroidFound) => {

                                                    if (AndroidFound) {

                                                        AndroidAppDB.deleteOne({Project_Id: deleteData.Project_Id}).exec().then((res) => {
                                                            if (res) {

                                                                var filePath = "./ConfiguredFiles/" + fileFound.App_Name + ".plist";
                                                                var pathToDelete = filePath;
                                                                fs.unlink(pathToDelete, function (err) {
                                                                    if (err) throw err;
                                                                    console.log('File deleted!');
                                                                });

                                                                var filePath = "./ConfiguredFiles/" + AndroidFound.App_Name + ".json";
                                                                var pathToDelete = filePath;
                                                                fs.unlink(pathToDelete, function (err) {
                                                                    if (err) throw err;
                                                                    console.log('File deleted!');
                                                                });

                                                                callback({
                                                                    response: '3',
                                                                    message: 'successfully deleted'
                                                                });
                                                            }
                                                            else {
                                                                callback({
                                                                    response: '0',
                                                                    message: 'Delete Operation Failed1'
                                                                });
                                                            }
                                                        }).catch((error) => {
                                                            console.log(error);
                                                        })

                                                    } else {

                                                        var filePath = "./ConfiguredFiles/" + fileFound.App_Name + ".plist";
                                                        var pathToDelete = filePath;
                                                        fs.unlink(pathToDelete, function (err) {
                                                            if (err) throw err;
                                                            console.log('File deleted!');
                                                        });

                                                        callback({
                                                            response: '3',
                                                            message: 'successfully deleted'
                                                        });

                                                    }

                                                }).catch((error) => {
                                                    console.log(error);
                                                })

                                            }
                                            else {

                                                callback({response: '0', message: 'Delete Operation Failed3'});

                                            }
                                        }).catch((error) => {
                                            console.log(error);
                                        })

                                    } else {

                                        AndroidAppDB.findOne({Project_Id: deleteData.Project_Id}).exec().then((AndroidFound) => {

                                            if (AndroidFound) {
                                                AndroidAppDB.deleteOne({Project_Id: deleteData.Project_Id}).exec().then((res) => {
                                                    if (res) {

                                                        var filePath = "./ConfiguredFiles/" + AndroidFound.App_Name + ".json";
                                                        var pathToDelete = filePath;
                                                        fs.unlink(pathToDelete, function (err) {
                                                            if (err) throw err;
                                                            console.log('File deleted!');
                                                        });

                                                        callback({response: '3', message: 'successfully deleted'});
                                                    }
                                                    else {
                                                        callback({response: '3', message: 'Delete Application'});
                                                    }


                                                }).catch((error) => {
                                                    console.log(error);
                                                })
                                            }
                                            else{
                                                callback({response: '3', message: 'successfully deleted'});
                                            }

                                        }).catch((error) => {
                                            console.log(error);
                                        })

                                    }
                                }).catch((error) => {
                                    console.log(error);
                                })

                            }

                            else {
                                callback({response: '0', message: 'Delete Operation Failed5'});
                            }
                        }).catch((error) => {
                            console.log(error);
                        })

                    }

                    else
                    {
                        callback({response: '0', message: 'no Data found'});
                    }
                }).catch((error) => {
                    console.log(error);
                })

            }
            else {
                callback({response: '0', message: 'no Data found'});
            }

        })

    },

    //===========================================Check Application With App & Secret Keys Data =====================================

    CheckAppWithKeys : function (testedKeys,callback) {

        console.log("App_Key ... ",testedKeys.App_Key);
        console.log("Secret_Key ... ",testedKeys.Secret_Key);

        IOSAppDB.findOne({App_Key : testedKeys.App_Key, Secret_Key:testedKeys.Secret_Key}).exec().then((iOSAppFound) => {

            if (iOSAppFound){

                callback({response : '3', App_Name : iOSAppFound.App_Name, Bundle_Identifier : iOSAppFound.Bundle_Identifier});

            }
            else {

                AndroidAppDB.findOne({App_Key : testedKeys.App_Key, Secret_Key:testedKeys.Secret_Key}).exec().then((AndroidAppFound)=>{

                    if (AndroidAppFound){

                        callback({response : '3', App_Name : AndroidAppFound.App_Name, Package_Name : AndroidAppFound.Package_Name});

                    }
                    else {
                        callback({response : '0'});
                    }

                }).catch((error) => {
                    console.log(error);
                })

            }

        }).catch((error) => {
            console.log(error);
        })

    }


};

module.exports = Application;


//==========*************=========================Following All Are Working Functions=============*************=================

//===========================================Add IOS & Android Applications Data ===============================================

/* AddApplication : function(appdata,callback){

     console.log(" SDK Req having data : ",appdata);

     DeveloperDB.findOne({DevId:appdata.DevId}).exec().then((devFound)=>{

         console.log(" Developer Found. ");

         if (devFound){

             ApplicationDB.findOne({App_Type:appdata.App_Type,Project_Name:appdata.Project_Name}).exec().then((AppFound) =>{

                 if (AppFound){

                     callback({response:"1",message:"Application with this name already existed."});

                 }
                 else {

                     if (appdata.App_Type === "iOS" || appdata.App_Type === "Android") {

                         var Created_Date = Math.floor(Date.now() / 1000);

                         var Modified_Date = Math.floor(Date.now() / 1000);

                         var newObj = new ApplicationDB({

                             App_Type: appdata.App_Type,
                             DevId: devFound.DevId,
                             Project_Id: appdata.Project_Id,
                             Project_Name: appdata.Project_Name,
                             Created_Date: Created_Date,
                             Modified_Date: Modified_Date

                         });

                         newObj.save(function (err) {

                             if (err) {
                                 console.log(err);
                                 callback({response: '0', message: err});
                             }
                             else {

                                 if (appdata.App_Type === "iOS") {

                                     var App_Key = "";
                                     var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                     for (var i = 0; i < 10; i++) {
                                         App_Key += possible.charAt(Math.floor(Math.random() * possible.length));
                                     }

                                     var Secret_Key = "";
                                     var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                     for (var i = 0; i < 16; i++) {
                                         Secret_Key += possible.charAt(Math.floor(Math.random() * possible.length));
                                     }

                                     var BundleId = appdata.Bundle_Identifier;
                                     var AppName = appdata.App_Name;
                                     var AppKey = App_Key;
                                     var SecretKey = Secret_Key;
                                     var AppStroreId = appdata.App_Store_Id;

                                     var xml =
                                         '<?xml version="1.0" encoding="UTF-8"?>' +
                                         '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' +
                                         '<plist version="1.0">' +
                                         '<key>metadata</key>' +
                                         '<dict>' +
                                         '<key>bundle-identifier</key>' +
                                         '<string>%B</string>' +
                                         '<key>AppName</key>' +
                                         '<string>%A</string>' +
                                         '<key>AppKey</key>' +
                                         '<string>%AK</string>' +
                                         '<key>SecretKey</key>' +
                                         '<string>%SK</string>' +
                                         '<key>AppStoreId</key>' +
                                         '<string>%aId</string>' +
                                         '</dict>' +
                                         '</plist>';

                                     var xml1 = xml.replace("%B", BundleId);
                                     var xml2 = xml1.replace("%A", AppName);
                                     var xml3 = xml2.replace("%AK", AppKey);
                                     var xml4 = xml3.replace("%SK", SecretKey);
                                     var xml5 = xml4.replace("%aId", AppStroreId);

                                     var data = plist.parse(xml5);

                                     var path = "./public/plistFiles/" + AppName + ".plist";

                                     plist.writeFile(path,data,function (err) {
                                         if (err){throw err;}
                                         console.log('file created');
                                     });

                                     var newIOS = new IOSAppDB({

                                         App_Name: appdata.App_Name,
                                         Bundle_Identifier: appdata.Bundle_Identifier,
                                         App_Store_Id: appdata.App_Store_Id,
                                         App_Key: App_Key,
                                         Secret_Key: Secret_Key,
                                         Project_Id:appdata.Project_Id,
                                         PlistFile:"14.98.168.118"+"./public/plistFiles/"+ AppName + ".plist"

                                     });

                                     newIOS.save(function (err) {

                                         if (err) {

                                             console.log(err);
                                             callback({response: '0', message: err});

                                         }
                                         else {

                                             var r = {response: '3', message: 'Your App was Added.'};
                                             callback(r);

                                         }

                                     });

                                 }

                                 else if (appdata.App_Type === "Android") {

                                     var App_Key1 = "";
                                     var possible1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                     for (var i = 0; i < 10; i++) {
                                         App_Key1 += possible1.charAt(Math.floor(Math.random() * possible1.length));
                                     }

                                     var Secret_Key1 = "";
                                     var possible11 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                                     for (var i = 0; i < 16; i++) {
                                         Secret_Key1 += possible11.charAt(Math.floor(Math.random() * possible11.length));
                                     }

                                     var PackageName = appdata.Package_Name;
                                     var AppName11 = appdata.App_Name;
                                     var AppKey11 = App_Key1;
                                     var SecretKey11 = Secret_Key1;
                                     var PlayStoreLink = appdata.PlayStore_Link;

                                     const file = "./public/jsonFiles/" + AppName11 + ".json";

                                     const obj = {

                                         Package_Name:PackageName,
                                         App_Name:AppName11,
                                         App_Key:AppKey11,
                                         Secret_Key:SecretKey11,
                                         PlayStore_Link:PlayStoreLink

                                     }

                                     jsonfile.writeFile(file, obj)
                                         .then(res => {
                                             console.log('Write complete')
                                         })
                                         .catch(error => console.error(error));

                                     var newAndroid = new AndroidAppDB({

                                         App_Name: appdata.App_Name,
                                         Package_Name: appdata.Project_Name,
                                         PlayStore_Link: appdata.PlayStore_Link,
                                         App_Key: App_Key11,
                                         Secret_Key: Secret_Key11,
                                         Project_Id:appdata.Project_Id,
                                         JSONFile:"14.98.168.118"+"./public/jsonFiles/"+ AppName11 + ".json"

                                     });

                                     newAndroid.save(function (err) {

                                         if (err) {

                                             console.log(err);
                                             callback({response: '0', message: err});

                                         }
                                         else {

                                             var r = {response: '3', message: 'Your App was Added.'};
                                             callback(r);

                                         }

                                     });

                                 }
                                 else {

                                     callback({response: '2', message: "Please Pass A valid Application Type."});

                                 }

                             }

                         });

                     }
                     else {

                             callback({response: '2', message: "Please Pass A valid Application Type."});

                         }

                 }

             });

         }
         else {

             callback({response : '0', message : " Invalid Developer. "});

         }

     });

 },*/

//===========================================Check & Add IOS & Android Applications Data =======================================

/*CheckAppDetails : function (AppDetails,callback) {

    DeveloperDB.findOne({DevId:AppDetails.DevId}).exec().then((DevFound)=>{

        if (DevFound) {

            ApplicationDB.findOne({
                Project_Id:AppDetails.Project_Id
            }).exec().then((ProjectFound) => {

                if (ProjectFound){

                    if (AppDetails.App_Type === "iOS") {

                        var App_Key1 = "";
                        var possible1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                        for (var i = 0; i < 10; i++) {
                            App_Key1 += possible1.charAt(Math.floor(Math.random() * possible1.length));
                        }

                        var Secret_Key1 = "";
                        var possible11 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                        for (var i = 0; i < 16; i++) {
                            Secret_Key1 += possible11.charAt(Math.floor(Math.random() * possible11.length));
                        }

                        var BundleId = AppDetails.Bundle_Identifier;
                        var AppName = AppDetails.App_Name;
                        var AppKey = App_Key1;
                        var SecretKey = Secret_Key1;
                        var AppStroreId = AppDetails.App_Store_Id;

                        var xml =
                            '<?xml version="1.0" encoding="UTF-8"?>' +
                            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' +
                            '<plist version="1.0">' +
                            '<key>metadata</key>' +
                            '<dict>' +
                            '<key>bundle-identifier</key>' +
                            '<string>%B</string>' +
                            '<key>AppName</key>' +
                            '<string>%A</string>' +
                            '<key>AppKey</key>' +
                            '<string>%AK</string>' +
                            '<key>SecretKey</key>' +
                            '<string>%SK</string>' +
                            '<key>AppStoreId</key>' +
                            '<string>%aId</string>' +
                            '</dict>' +
                            '</plist>';

                        var xml1 = xml.replace("%B", BundleId);
                        var xml2 = xml1.replace("%A", AppName);
                        var xml3 = xml2.replace("%AK", AppKey);
                        var xml4 = xml3.replace("%SK", SecretKey);
                        var xml5 = xml4.replace("%aId", AppStroreId);

                        var data = plist.parse(xml5);

                        var path = "./ConfiguredFiles/" + AppName + ".plist";

                        plist.writeFile(path,data,function (err) {
                            if (err){throw err;}
                            console.log('file created');
                        });

                        var newIOS = new IOSAppDB({

                            App_Name: AppDetails.App_Name,
                            Bundle_Identifier: AppDetails.Bundle_Identifier,
                            App_Store_Id: AppDetails.App_Store_Id,
                            App_Key: App_Key1,
                            Secret_Key: Secret_Key1,
                            Project_Id:AppDetails.Project_Id,
                            PlistFile:"localhost:8097/"+"ConfiguredFiles/"+ AppName + ".plist"

                        });

                        newIOS.save(function (err) {

                            if (err) {

                                console.log(err);
                                callback({response: '0', message: err});

                            }
                            else {

                                var r = {response: '3', message: 'Your App was Added.'};
                                callback(r);

                            }

                        });

                    }

                    else if (AppDetails.App_Type === "Android") {

                        var App_Key2 = "";
                        var possible2 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                        for (var i = 0; i < 10; i++) {
                            App_Key2 += possible2.charAt(Math.floor(Math.random() * possible2.length));
                        }

                        var Secret_Key2 = "";
                        var possible22 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                        for (var i = 0; i < 16; i++) {
                            Secret_Key2 += possible22.charAt(Math.floor(Math.random() * possible22.length));
                        }

                        var newAndroid = new AndroidAppDB({

                            App_Name: AppDetails.App_Name,
                            Package_Name: AppDetails.Package_Name,
                            PlayStore_Link: AppDetails.PlayStore_Link,
                            App_Key: App_Key2,
                            Secret_Key: Secret_Key2,
                            Project_Id:AppDetails.Project_Id

                        });

                        newAndroid.save(function (err) {

                            if (err) {

                                console.log(err);
                                callback({response: '0', message: err});

                            }
                            else {

                                var r = {response: '3', message: 'Your App was Added.'};
                                callback(r);

                            }

                        });

                    }
                    else {

                        callback({response: '2', message: "Please Pass A valid Application Type."});

                    }

                }
                else {
                    callback({response : '0', message : 'Project Not Available.'});
                }

            }).catch((error) => {
                console.log(error);
            })

        }
        else {
            callback({response : '0', message : 'Invalid Developer.'});
        }

    }).catch((error) => {
        console.log(error);
    })

},*/

//===========================================Fetch Applications Data Using POST=================================================

/*FetchApplication : function (fetchData,callback) {
    DeveloperDB.findOne({DevId:fetchData.DevId},{_id:false,__v:false}).exec().then((results)=> {

        if (results) {

            ApplicationDB.find({DevId: fetchData.DevId},{_id:false,__v:false}).exec()
                .then((humanclient) => {

                    ApplicationDB.aggregate([
                        {
                            $match: {
                                DevId: fetchData.DevId
                            }
                        },
                        {
                            $lookup: {
                                from: "sdkiosapps",
                                localField: "Project_Id",
                                foreignField: "Project_Id",
                                as: "iOS"
                            }
                        },
                        {
                            $lookup: {
                                from: "sdkandroidapps",
                                localField: "Project_Id",
                                foreignField: "Project_Id",
                                as: "Android"
                            }
                        }
                    ]).exec()
                        .then((hreservData) => {

                            if (hreservData) {
                                var r = {
                                    response: '3',
                                    Applications: hreservData
                                };
                                callback(r);
                            }
                        }).catch((error) => {
                        console.log(error);
                    })

                }).catch((error) => {
                console.log(error);
            })

        }
        else {

            var r = {
                response: '0',
                message: "You dont have Applications"
            };
            callback(r);

        }
    })
},*/


