var APIListDB = require("../models/APIsList");

var APIList = {

    //=============================================== ADD API To API's-LIST =============================================================

    AddAPItoLIST : function (APIData,callback) {

        APIListDB.findOne({API_Name : APIData.API_Name, API_For: APIData.API_For, Category: APIData.Category}).exec().then(APIFound => {

            if(APIFound){

                callback({response : '0', message : 'API is already available.'});

            }
            else {

                var API_Id = "";
                var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                for (var i = 0; i < 10; i++) {
                    API_Id += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                var NewAPI = new APIListDB({
                    API_Id : "Spec-"+API_Id,
                    API_Name : APIData.API_Name,
                    Category : APIData.Category,
                    API_For : APIData.API_For,
                    API_Description : APIData.API_Description
                });

                NewAPI.save(function (err) {

                    if (err) {

                        console.log(err);
                        callback({response: '0', message: err});

                    }
                    else {

                        var r = {response: '3', message: 'Your API data was added.'};
                        callback(r);

                    }

                });

            }

        }).catch((error) => {
            console.log(error);
        })
    },

    //=============================================== UPDATE API From API's-LIST =============================================================

    UpdateAPIFromList : function (UpdateAPIData,callback) {

        APIListDB.findOne({API_Id: UpdateAPIData.API_Id}).exec().then(APIDataFound => {

            if (APIDataFound){

                APIListDB.findOne({API_Name: UpdateAPIData.API_Name,Category: UpdateAPIData.Category,API_For: UpdateAPIData.API_For}).exec().then(HavingAPI => {

                    if (HavingAPI){

                        if (HavingAPI.API_Id == UpdateAPIData.API_Id){

                            APIListDB.updateOne({API_Id: UpdateAPIData.API_Id}, {
                                $set: {

                                    API_Name : UpdateAPIData.API_Name,
                                    Category : UpdateAPIData.Category,
                                    API_For : UpdateAPIData.API_For,
                                    API_Description : UpdateAPIData.API_Description

                                }
                            }).exec().then((APIUpdated) => {
                                if (APIUpdated) {
                                    callback({response: '3', message: 'Your API successfully updated.'});
                                }
                                else {
                                    callback({response: '0', message: 'Your API not updated.'});
                                }

                            }).catch((error) => {
                                console.log(error);
                            })

                        }
                        else {
                            callback({response:'2', message:'API available for these values.'});
                        }

                    }

                    else {

                        APIListDB.updateOne({API_Id: UpdateAPIData.API_Id}, {
                            $set: {

                                API_Name : UpdateAPIData.API_Name,
                                Category : UpdateAPIData.Category,
                                API_For : UpdateAPIData.API_For,
                                API_Description : UpdateAPIData.API_Description

                            }
                        }).exec().then((APIUpdated) => {
                            if (APIUpdated) {
                                callback({response: '3', message: 'Your API successfully updated.'});
                            }
                            else {
                                callback({response: '0', message: 'Your API not updated.'});
                            }

                        }).catch((error) => {
                            console.log(error);
                        })

                    }

                })

            }
            else {
                callback({response:'0',message:'no data found'});
            }

        }).catch((error) => {
            console.log(error);
        })

    },

    //=============================================== GET API-List From API's-LIST =============================================================

    GetAPIsList : function (callback) {

        console.log("Fetch API's List");

        APIListDB.find({},(err,data) =>{
            if (err)
                console.log(err);
            else
                callback({result: '3', apisdata: data});
        })

    },

    //===========================================Delete API From APIs List  ===========================================================

    DeleteAPIFromList : function (deleteAPIData,callback) {

        APIListDB.findOne({API_Id:deleteAPIData.API_Id}).exec().then(Found => {

            if(Found) {

                APIListDB.deleteOne({API_Id: deleteAPIData.API_Id}).exec().then((deleted) => {

                    if (deleted) {

                        callback({response: "3", message: "deleted successfully."});

                    }
                    else {
                        callback({response: "0", message: "failed to delete."});
                    }

                }).catch((error) => {
                    console.log(error);
                })
            }
            else {
                callback({response: "0", message: "no data found."});
            }

        }).catch((error) => {
            console.log(error);
        })

    }






    };

module.exports = APIList;