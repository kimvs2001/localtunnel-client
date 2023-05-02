var express = require('express');
// var request = require('request');
var router = express.Router();


// Mongoose 모듈 가져오기
const mongoose = require('mongoose');


const globalVar = require('./global/global.js');
var db = require('./lib/db-manager');
db.connectDB(globalVar.DB_NAME_BASIC_INFO_DB);

var subdomainSchema = require('./models/subdomainSchema');
const { reject } = require('async');
var model = mongoose.model('subdomain',subdomainSchema);

var DOCKER_LOCAL_HOST = globalVar.DOCKER_IP;



let isBusy = false;
let isConnected = false;
global.isConnected = isConnected;
global.isBusy = isBusy;

// response 에 Error 설명
//  BUSY // 이미 요청 중 , 중복 요청 방지
//  ALEADY_CONNECTED // 이미 연결 됨, 중복 연결 방지
// ERR_WRONG_DOMAIN  // 잘못 된 subdmomain 요청






const saveAtDB = (subdomain,clientPort,fullURL)=>{
    const date = new Date();
    const localTime = date.toLocaleString();
    const data = new model({
      subdomain: subdomain, 
      clientPort: clientPort,
      date: Date.now(),
      localDate : localTime,
      fullURL : fullURL
    });

    // save to DB
    data.save((err, data) => {
      if (err) {
        if(err instanceof mongoose.Error.ValidationError) {
          console.log('유효성 검사 오류:');
        }
        else if( err.code === 11000){
          console.error('중복된 sub domain 입니다.');
        }
        else{
          console.error('저장 실패, mongoose 에러 코드 : ', err);
        }
      } else {
        console.log('다음과 같은 데이터가 MongoDB에 저장되었습니다.', data);
      }
     });
}

router.get('/tunneling',async function(req,res){

    console.log("isBusy:" + global.isBusy);
    console.log("isConnected:" + global.isConnected);
    var paramDomainName =  req.query.domainName ? req.query.domainName:"";
    if (paramDomainName.length < 1  ){ // 주소가 이상하면,
      return res.json({result:'WRONG_SUBDOMAIN'});
    }
    else{ // 주소는 정상 이고,
          
      if(global.isConnected) { // 이미 연결이 되어있을 때,
        return res.json({result:'ALEADY_CONNECTED'});
       }
       if(global.isBusy){ // 이미 연결 시도 중일 때,
        return res.json({result:'BUSY'});
       }
       
    }
 
    const subdomain = paramDomainName.split('.')[0];
    const clientPort = Number(req.headers.host.split(':')[1]);
    global.isBusy = true;

    var argvs = { 
                  localhost:DOCKER_LOCAL_HOST,
                  port:80,
                  host:`http://smartroot.co.kr:3333`,
                  // host:`http://smartroot.co.kr:8080`,
                  subdomain:subdomain,
                  clientPort:clientPort
                } 
    var lt = require('./lt');
    lt.init(argvs);
   
    
    console.log('hi, connecting to server...');
    

    const timeout = new Promise((resolve,reject)=>{
      const id = setTimeout(()=>{
        clearTimeout(id);
        reject('timeout');
      },10000)
    })
    const promise = new Promise(async (resolve,reject)=>{
      try{
        var res = await lt.tunneling();
      }
      catch(err){
        reject('response undefined');

      }
      resolve(res);
    
    })
    .catch(err=>{
       console.log('[express-router.js] err ===>',);
      //  console.log(err);
       console.log('<=== err [express-router.js]');
       reject('response undefined');
    });

  
  
  Promise.race([promise,timeout]).then(response=>{
    console.log("success!! response is : "+response);
    global.isConnected = true;
    console.log("isConnected:" + global.isConnected);
    global.isBusy = false;
    

    const host = argvs.host.split('/')[2];
    var fullURL  = "http://"+argvs.subdomain+"."+host
    // save At  mongo DB
    saveAtDB(argvs.subdomain,argvs.clientPort,fullURL);
    
    return res.json({result:true});
    
  }).catch(err=>{
    // console.log("ERROR",err); //timeout
    global.isConnected = false;
    global.isBusy = false;
    
    //saveAtDB(argvs.subdomain); //delete !!!! this is just for testing

    return res.json({result:'error'});
  });
  });

  // db에 데이터 모두 삭제
  router.get('/dbclear',async function(req,res){

    model.deleteMany({}, (err) => {
      if (err) {
        console.error('데이터 삭제 실패:', err);
        return res.json({result:'failed to db clear'});
      } else {
        console.log('모든 데이터 삭제 성공');
        return res.json({result:'success to db clear'});
      }});

  });

  router.get('/reset',function(req,res){
      global.isConnected = false;
      console.log('global.isConnected = false');
      return res.json({result:'isConnected = false'});

  });
module.exports = router;
