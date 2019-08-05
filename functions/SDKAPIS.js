var SdkProjAPIDB = require("../models/API");
var SdkAPIListDB = require("../models/APIsList");
var SdkAppDB = require("../models/SDKApplication");

var APIS = {

    //=============================================== ADD API To Project =============================================================

    AddAPIsListToProject : function (ProjectData,callback){

        console.log("Add APIs-List to Proj Req Data : ", ProjectData);

        SdkProjAPIDB.find({Proj_Id:ProjectData.Proj_Id}).exec().then(ProjectHavingAPIs => {

            //console.log("The Data ",ProjectHavingAPIs);

            if (ProjectHavingAPIs == 0 ){

                SdkAPIListDB.find({}).exec().then(AllAPIsList => {

                    console.log("Size of that : ",AllAPIsList.length);

                    for(i=0; i<AllAPIsList.length; i++){

                        var AddAPIs = new SdkProjAPIDB({
                            DevId : ProjectData.DevId,
                            Proj_Id : ProjectData.Proj_Id,
                            API_Id : AllAPIsList[i].API_Id,
                            API_Name : AllAPIsList[i].API_Name,
                            Initial_Count : 50,
                            Completed_Count : 0,
                            IsEnable : false
                        });

                        AddAPIs.save(function (err) {

                            if (err) {

                                console.log(err);
                                callback({response: '0', message: err});

                            }
                            else {
                                //var r = {response: '3', message: 'Your APIs data was Added to Project.'};
                                //callback({response:'3'});
                            }

                        });

                    }

                    callback({response:'3',message:'All APIs are added'});

                }).catch((error) => {
                    console.log(error);
                })

            }
            else {

                callback({response:'2',message:'project having apis'});

            }
        }).catch((error) => {
            console.log(error);
        })

    },

    //=============================================== Enable The API On Project API's-List =============================================================

    EnableTheAPI : function (EnableAPIData,callback) {

        console.log(" Enable API Req Data : ", EnableAPIData );

        SdkProjAPIDB.findOne({DevId: EnableAPIData.DevId,Proj_Id : EnableAPIData.Proj_Id, API_Id : EnableAPIData.API_Id}).exec().then(ProjectHavingAPI => {

            if (ProjectHavingAPI) {

                SdkProjAPIDB.updateOne({DevId: EnableAPIData.DevId, Proj_Id : EnableAPIData.Proj_Id, API_Id : EnableAPIData.API_Id} ,
                                        {
                                            $set : {
                                                IsEnable : true
                                            }
                                        }
                ).exec().then(UpdatedTheAPI => {

                    if (UpdatedTheAPI){
                        callback({response : '3', message : 'Api Enabled.'});
                    }
                    else {
                        callback({response : '0', message : 'Api Enable Failed.'});
                    }

                }).catch((error) => {
                    console.log(error);
                })

            }
            else {
                callback({response : '0', message : 'No Data Available.'});
            }

        }).catch((error) => {
            console.log(error);
        })

    },

    //=============================================== Disable The API On Project API's-List =============================================================

    DisableTheAPI : function (DisableAPIData,callback) {

        console.log(" Disable API Req Data : ", DisableAPIData );

        SdkProjAPIDB.findOne({DevId: DisableAPIData.DevId, Proj_Id : DisableAPIData.Proj_Id, API_Id : DisableAPIData.API_Id}).exec().then(APIDataFound => {

            if (APIDataFound){

                if (APIDataFound.IsEnable == true){

                    SdkProjAPIDB.updateOne({DevId: DisableAPIData.DevId, Proj_Id : DisableAPIData.Proj_Id, API_Id : DisableAPIData.API_Id} ,
                        {
                            $set : {
                                IsEnable : false
                            }
                        }
                    ).exec().then(DisabledAPI => {

                        if (DisabledAPI){
                            callback({response : '3', message : 'Api Disabled.'});
                        }
                        else {
                            callback({response : '0', message : 'Api Disable Failed.'});
                        }

                    }).catch((error) => {
                        console.log(error);
                    })

                }
                else if (APIDataFound.IsEnable == false){
                    callback({response : '2', message : 'API is not enabled.'})
                }
            }

            else {
                callback({response : '0', message : 'no data found.'})
            }
        })

    },

    //=============================================== Get All API's On Project API's-List =============================================================

    GetAllAPIsUnderProject : function (userid,callback) {
        SdkProjAPIDB.find({Proj_Id:userid},{_id:0,__v:0}).exec()
            .then((HavingAPIs) => {
                console.log("From Model : "+userid);

                if (HavingAPIs == 0 ){

                    callback({response : '0', message : 'No Data Available.'});

                }
                else {
                    callback({response : '3', ListOfAPIsUnderProject : HavingAPIs});
                }

            }).catch((error) => {
            console.log(error);
            })
    },

    //=============================================== Add Count API On Project API's-List =============================================================

    AddAPICountToAPIs : function (APIReqData,callback) {

        SdkAppDB.findOne({Project_Id : APIReqData.Proj_Id, DevId : APIReqData.DevId}).exec().then(ProjIdFound => {

            if (ProjIdFound){

                SdkProjAPIDB.findOne({API_Id : APIReqData.API_Id, Proj_Id : ProjIdFound.Project_Id}).exec().then(APIFound => {

                    if(APIFound.IsEnable == true){

                        var maxCount = 50;

                        var maxCount1 = maxCount;

                        if(APIFound.Completed_Count == parseInt(maxCount1)){

                            callback({response : '0', message : 'buy to continue our services.'});

                        }
                        else{

                            var addOne = 1;

                            var Completed_Count_From_Db = APIFound.Completed_Count;

                            var updateCount = (parseInt(Completed_Count_From_Db)) + (parseInt(addOne)) ;

                            var PendingCount = (parseInt(APIFound.Initial_Count)) - ((parseInt(Completed_Count_From_Db))+(parseInt(addOne)));

                            SdkProjAPIDB.updateOne({API_Id : APIReqData.API_Id} ,
                                {
                                    $set : {
                                        //Initial_Count : PendingCount,
                                        Completed_Count : updateCount
                                    }
                                }
                            ).exec().then(UpdatedTheAPI => {

                                if (UpdatedTheAPI){
                                    callback({response : '3', PendingRequests : PendingCount.toString()});
                                }
                                else {
                                    callback({response : '0', message : 'Count Update failed.'});
                                }

                            }).catch((error) => {
                                console.log(error);
                            })

                        }

                    }
                    else {
                        callback({response : '2', message : 'you dont have access permission of this API.'});
                    }



                })

            }
            else {
                callback({response : '0', message : 'no data found.'})
            }

        });

    }



};

module.exports = APIS;