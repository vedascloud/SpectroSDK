var jsonfileDB = require('../models/sdkJsonFiles');
var userDB = require('../models/SDKDeveloper');
var fs = require('fs');
const Busboy = require('busboy');

var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('dmY');

var jsonHandling = {

    uploadJSON : (params,filesData,headers,req,callback) => {

        function uploadToFolder(file,fields) {

            if(fields.username==='viswa'){

                jsonfileDB.findOne({filename:file.name}).exec()
                    .then((jsonfileFound) => {

                        //File Update
                        if(jsonfileFound){

                            var filename = file.name;

                            file.mv('./public/sdkjsonfiles/' +filename, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    //res.send('File uploaded!');
                                    jsonfileDB.find({}, (er, len) => {
                                        if (er) {
                                            console.log(er);
                                        }
                                        else if (len.length > 0) {
                                            jsonfileDB.updateOne({'filename': filename}, {
                                                $set: {
                                                    'filename': filename,
                                                    'addedDate': Math.floor(Date.now() / 1000),
                                                    'API_category': fields.API_category,
                                                    'type': fields.type,
                                                    'url': "https://14.98.168.118/sdkjsonfiles/" + file.name
                                                }
                                            }, (em, sm) => {
                                                if (em) {
                                                    console.log(em);
                                                } else {
                                                    console.log(sm);

                                                    callback({
                                                        result: '2',
                                                        message: 'file updated',
                                                        //url: "/sdkjsonfiles/" + file.name
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        }
                        //File Upload/Add
                        else{

                            var date = Math.floor(Date.now() / 1000);

                            console.log('Present Date...',date);

                            var id = ""; //random text
                            var possible = "0123456789";

                            for( let i=0; i < 5; i++ ){
                                id +=  possible.charAt(Math.floor(Math.random() * possible.length));
                            }
                            let d= Date.now();
                            //let imagepath = "./public/jsonfiles/"+text+d+file.name;
                            //let imagepath = "./public/sdkjsonfiles/"+file.name;
                            let imagepath = "./public/sdkjsonfiles/"+"file_"+id+".json";

                            console.log("file path : ",imagepath);

                            file.mv(imagepath, (err,suc) => {
                                if(err){
                                    throw err;
                                }else{
                                    console.log('form data fields...',fields);
                                    var jsonDB = new jsonfileDB({
                                        DevId:fields.DevId,
                                        //filename:file.name,
                                        filename:"file_"+id+".json",
                                        id:"file_" +id,
                                        addedDate:date,
                                        API_category:fields.API_category,
                                        type:fields.type,
                                        url: "https://14.98.168.118/sdkjsonfiles/"+"file_"+id+".json",
                                        API_Id:fields.API_Id
                                    });

                                    jsonDB.save((success) => {
                                        //console.log('request body..'+success);
                                        callback({
                                            response:'3',
                                            message:'Your JSON file has been successfully stored.',
                                            //url:"/sdkjsonfiles/"+file.name
                                        });
                                    });

                                }
                            });

                        }
                    })

            }
            else{
                callback({response:'0',message:'user is invalid'});
            }
        }

        var busboy = new Busboy({ headers: headers });

        // The file upload has completed
        busboy.on('finish', function() {

            // Grabs your file object from the request.
            const file = filesData.jsonfile;

            // Begins the upload to the AWS S3
            uploadToFolder(file,params);

        });

        req.pipe(busboy);
    },

    //FileRead
    fetchJSONFile : (user,callback) => {

        if(user.username==='viswa') {

                        jsonfileDB.findOne({filename: user.filename}, {
                            _id: false,
                            __v: false,
                            url: false
                        }).exec().then((res) => {
                            if (res) {

                                /*var obj;
                                fs.readFile('./public/sdkjsonfiles/'+user.filename,  function (err, data) {
                                    if (err) throw err;
                                  //  obj = JSON.stringify(data,null,3);
                                    callback(data);
                                    //callback({response: '3', FileData: data});
                                });*/

                              //  let jsonData = require('../public/sdkjsonfiles/'+user.filename);
                                // let jsonData = require('./file') // omitting .json also works


                                //JSON File Reading Using big-json
                                const json = require('big-json');

                                const readStream = fs.createReadStream('./public/sdkjsonfiles/' + user.filename);
                                const parseStream = json.createParseStream();

                                parseStream.on('data', function(pojo) {
                                    // => receive reconstructed POJO
                                    //callback({response: '3', FileData: pojo});
                                    callback(pojo);
                                });

                                readStream.pipe(parseStream);



                               /* //JSON File Reading Using readFileSync
                                let rawdata = fs.readFileSync('./public/sdkjsonfiles/' + user.filename);
                                let student = JSON.parse(rawdata);
                                console.log(student);*/





                                //JSON File Reading Using readFile
                               /* fs.readFile("./public/sdkjsonfiles/" + user.filename, 'utf-8', function (err, data) {

                                    //var str = data.toString();

                                    //var str2 = str.replace("\n","");

                                //console.log("file data ... ",str);

                                    var data1 = JSON.parse(data);

                                    callback({response: '3', FileData: data1});


                                    //callback({response: '3', FileData: "./sdkjsonfiles/" + user.filename});
                            })*/

                                //callback({response: '3', FileURL: "http://54.210.61.0:8096"+"/sdkjsonfiles/" + user.filename});
                            }
                            else {
                                callback({response:'0',message:'Invalid File.'});
                            }
                        }).catch((err) => {
                            console.log(err);
                        })

        }
        else{
            callback({response:'0',message:'user is invalid'});
        }


    },

    //Fetch Files
    fetchJSON : (user,callback) => {
        userDB.findOne({email:user.username},{_id:0,__v:0,url:0}).exec().then((results)=> {
                // console.log(results);
                if (results) {
                    jsonfileDB.find({}, {_id: false, __v: false,url:false}).exec().then( (res) => {

                        if (res){

                            console.log('all files data... ',res);

                            var file = res;

                            console.log('filedata... ',file[0]);

                            var fname = file[0].filename;

                            console.log('only filename..',fname);

                            var fields = fname.split('.');

                            console.log('after split..',fields);

                            //filename.getElementsByName('filename')[0].placeholder='';

                            callback({response: '3', files: res});

                        }

                        //callback({response: '3', files: res});
                    }) .catch((err) => {
                        console.log(err);
                    })
                }
                else {
                    callback({response: '0', message: 'user dont have account'});
                }
            }
        ).catch((error) => {
            console.log(error);
        })
    },

    //Delete File
    deleteJSON : (data,callback) => {

        jsonfileDB.findOne({filename:data.filename}).exec().then((fileFound)=>{

            if(fileFound){

                jsonfileDB.deleteOne({filename: data.filename}).exec().then((res) => {
                    if(res){
                        console.log('path of a file..', fileFound.url);
                        fs.unlink('./public'+fileFound.url , (er, sc) => {
                            if (er) {
                                console.log('error found,', er);
                            }else {
                                console.log(sc);
                            }
                            callback({result: '3', message: 'successfully deleted'});
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                })

            }else
            {
                callback({result: '0', message: 'no file found'});
            }
        }).catch((error) => {
            console.log(error);
        })
    }

};

module.exports = jsonHandling;