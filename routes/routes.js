var RegisterFunction = require('../functions/SDKRegistration');
var Verify=require('../functions/SDKVerification');
var Login=require('../functions/SDKLogin');
var Forgot=require('../functions/SDKForgetpassword');
var Newpassword =require('../functions/SDKSetpassword');
var Application = require('../functions/SDKApplication');
var APIList = require('../functions/SDKAPIList');
var APIs = require('../functions/SDKAPIS');

var jsonController = require('../functions/sdkjsonfiles');
var SdkFetchController = require('../functions/SDKFetchAll');

const Busboy = require('busboy');
const fileUpload = require('express-fileupload');

/*router.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));*/

module.exports = function(app,io) {

    //==============================Developer Registration Router===========================
    app.post('/spectrosdk/register',(req,res) => {
        console.log('request body...',req.body);

        if(typeof req.body === 'undefined'){
            res.json({response:'0',message:'no content to process your request'});
        }else {
            RegisterFunction.addDeveloper(req.body,(result) => {
                console.log('result from function..',result);
                res.json(result);
            });
        }

    });

    //==============================Developer Verification Router===========================

    app.post('/spectrosdk/verify',function(req,res,next){

        if(typeof req.body === 'undefined'){
            res.json({response:'0',message:'no content to process your request'});
        }else {
            Verify.verifyDeveloper(req.body, (result) => {

                console.log('callback response,,,', result);
                res.json(result);

            });
        }

    });

    //==============================Developer Login Router===========================

    app.post('/spectrosdk/login',function(req,res,next){

        if(typeof req.body === 'undefined'){
            res.json({result:'0',message:'no request content'});
        }else{
            Login.loginAuthentication(req.body,(result) => {
                res.json(result);
            });
        }
    });

    //==============================Developer Forgot Pwd Router===========================

    app.post('/spectrosdk/forgot',function(req,res,next){

        if(typeof req.body === 'undefined'){
            res.json({response:'0',message:'no content to process your request'});
        }else {
            Forgot.forgot(req.body, (result) => {
                console.log(result);
                res.json(result);
            })
        }

    });

    //==============================Developer NewPassword Router===========================

    app.post('/spectrosdk/newpassword',function(req,res,next){

        if(typeof req.body === 'undefined'){
            res.json({response:'0',message:'no content to process your request'});
        }else {
            Newpassword.setpassword(req.body, (result) => {
                console.log(result);
                res.json(result);

            });
        }

    });

    //==============================Check-And-Add Application Router===========================

    app.post('/spectrosdk/checkandadd',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            Application.CheckApplication(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Add IOS App Router===========================

    app.post('/spectrosdk/addios',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            Application.AddCheckedIOSApplication(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Add Android App Router===========================

    app.post('/spectrosdk/addandroid',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            Application.AddCheckedAndroidApplication(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Update IOS App Router===========================

    app.put('/spectrosdk/updateios',(req,res) => {

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            Application.UpdateIOSApplication(req.body, (result) => {

                console.log('callback response...', result);

                res.send(result);

            })
        }

    });

    //==============================Update Android App Router===========================

    app.put('/spectrosdk/updateandroid',(req,res) => {

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            Application.UpdateAndroidApplication(req.body, (result) => {

                console.log('callback response...', result);

                res.send(result);

            })
        }

    });

    //==============================Fetch Data Router===========================

    app.get('/spectrosdk/:userid', function(req,res)  {

        Application.GetApplication(req.params.userid,(result) => {
            console.log("From Router : "+req.params.userid);

            res.json(result);
            console.log("From Router : "+result);
        });

    });

    //==============================Delete App Router===========================

    app.delete('/spectrosdk/deleteapp',(req,res) => {

        if(typeof req.body === 'undefined'){
            res.json({result:'error',message:'no content found'});
        }else {
            Application.DeleteApplication(req.body,(result) => {
                console.log('result...',result);
                res.json(result);
            })
        }

    });

    //==============================App & Secret Key Checking Router===========================

    app.post('/spectrosdk/keychecking',(req,res)=>{

        if (typeof  req.body === 'undefined'){
            res.json({result:'error', message:'no content found'})
        }
        else {
            Application.CheckAppWithKeys(req.body,(result) => {
                console.log('result...',result);
                res.json(result);
            })
        }

    });

    //==============================Add API to API's-List Router===========================

    app.post('/spectrosdk/addapilist',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            APIList.AddAPItoLIST(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Update API to API's-List Router===========================

    app.put('/spectrosdk/updateapilist',(req,res) => {

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            APIList.UpdateAPIFromList(req.body, (result) => {

                console.log('callback response...', result);

                res.send(result);

            })
        }

    });

    //==============================Get API's-List From API's-List Router===========================

    /*app.get('/spectrosdk/getapislist',(req,res)=>{

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            APIList.GetAPIsList((result) => {

                console.log('callback response...', result);

                res.send(result);
            })
        }
    });*/

    app.get('/getapislist', (req,res) =>  {

        APIList.GetAPIsList((result) => {
            console.log("From Router : "+result);

            res.json(result);
            console.log("From Router : "+result);
        });

    });

    //==============================Delete API Router===========================

    app.delete('/spectrosdk/deleteapi',(req,res) => {

        if(typeof req.body === 'undefined'){
            res.json({result:'error',message:'no content found'});
        }else {
            APIList.DeleteAPIFromList(req.body,(result) => {
                console.log('result...',result);
                res.json(result);
            })
        }

    });

    //==============================Add APIs-List to Project Router===========================

    app.post('/spectrosdk/addapislist',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            APIs.AddAPIsListToProject(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Add API Count  Router===========================

    app.post('/spectrosdk/addapicount',(req,res) => {

        if (typeof req.body === 'undefined'){
            res.json({response:'0', message:'no content to process your request'});
        }
        else {
            APIs.AddAPICountToAPIs(req.body,(result) => {

                console.log('callback response...',result);
                res.json(result);

            });
        }

    });

    //==============================Enable The API On Project API's-List Router===========================

    app.put('/spectrosdk/enableapi',(req,res) => {

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            APIs.EnableTheAPI(req.body, (result) => {

                console.log('callback response...', result);

                res.send(result);

            })
        }

    });

    //==============================Disable The API On Project API's-List Router===========================

    app.put('/spectrosdk/disable/api',(req,res) => {

        if(typeof req.body === 'undefined' ){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            APIs.DisableTheAPI(req.body, (result) => {

                console.log('callback response...', result);

                res.send(result);

            })
        }

    });

    //==============================Get All API's-List Belongs to Project From API's-List Router===========================

    /*app.get('/getprojectapislist', (req,res) =>  {

        APIs.GetAllAPIsUnderProject((result) => {
            console.log("From Router : "+result);

            res.json(result);
            console.log("From Router : "+result);
        });

    });*/


    app.get('/getprojectapislist/:userid', function(req,res)  {

        APIs.GetAllAPIsUnderProject(req.params.userid,(result) => {
            console.log("From Router : "+req.params.userid);

            res.json(result);
            console.log("From Router : "+result);
        });

    });

    //============================== SDK JSON Files API's Router===========================

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    }));

    app.post('/sdkjsonfiles/upload',(req,res) => {

        if(typeof req.body === undefined || typeof req.files === undefined){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            jsonController.uploadJSON(req.body, req.files, req.headers, req, (result) => {

                res.send(result);
            })
        }

    });

    app.post('/sdkjsonfiles/fileread',(req,res) => {

        if(typeof req.body === undefined || typeof req.files === undefined){
            res.json({response:'0',message:'No content found to process your request'});
        }else {

            jsonController.fetchJSONFile(req.body, (result) => {

                res.set('Content-Type','application/json');
                res.send(result);

                //res.send({result});
            })
        }

    });

    app.post('/sdkjsonfiles/getallstripes',(req,res) => {

        jsonController.fetchJSON(req.body,(result) => {
            console.log(result);
            res.json(result);
        })

    });

    app.delete('/sdkjsonfiles/deletefile',(req,res) => {

        if(typeof req.body.filename === 'undefined'){
            res.json({result:'error',message:'no content found'});
        }else {
            jsonController.deleteJSON(req.body,(result) => {
                console.log('result...',result);
                res.json(result);
            })
        }

    });

    //==============================Fetch All SDK Data Router===========================

    app.post('/fetchsdkdata/web', function(req,res)  {

        SdkFetchController.FetchSDKWeb(req.body,(result) => {
            console.log("From Router : "+req.body);

            /*if (err) {
                 return res.json(err);
            }

            else{*/
            //console.log('result...',result);
                res.json(result);
            //}

        });

    });

    //======================================================= Fetch API's & JSON-Files Data Using DevId ====================================================

    app.post('/fetchsdkapisdata/jsonfilesdata', function(req,res)  {

        SdkFetchController.FetchAPIsAndJsonFilesData(req.body,(err,result) => {
            console.log("From Router : "+req.body);

            if (err) {
                 return res.json(err);
            }

            else{
            //console.log('result...',result);
            res.json(result);
            }

        });

    });

};

