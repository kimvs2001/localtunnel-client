var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('./express-router.js');
const mongoose = require('mongoose');
var subdomainSchema = require('./models/subdomainSchema.js');
var model = mongoose.model('subdomain',subdomainSchema); 
const http = require('http');


const globalVar = require('./global/global.js');
const dbname = globalVar.DB_NAME_BASIC_INFO_DB;
const port = globalVar.INTO_PORT;
const ip = globalVar.DOCKER_IP;
const EDIT_MSG = 'edited by kjh at 2023.04.18 \
                \nedited by kjh at 2024.09.20 when /reset call, process exit ';

new Promise((resolve,reject)=>{
    console.log('local-tunnel-client. start.');
    // DB 연결
    try {
        mongoose.connect(`mongodb://${globalVar.DB_IP}/${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true })
        var db = mongoose.connection;

       // 4. 연결 실패

        db.on('error', function(){
        console.log('Connection Failed!');
    });
      // 5. 연결 성공
        db.once('open', function() {
        console.log('Connected!');
        resolve({msg:'몽고DB연결성공'});

    });
    } catch (error) {
        console.log('몽고DB 연결 실패 :',error);
        //reject();
    }

})
.then((data)=>{
    return new Promise( (resolve,reject)=>{
        // 서버 오픈
        console.log(data.msg);
        try {          
             
             app.use('/api',router);   
             app.listen(port, function(){
                resolve({msg:`server started on ${port}\n${EDIT_MSG}`})
            })
        } catch (error) {
            console.log('서버 오픈 에러');
        }
        
    })
})
.then(async (data)=>{
    return await new Promise((resolve,reject)=>{
        //값 조회
        console.log(data.msg);
        try {
            model.findOne({},function(err,result){
                if(err) throw err;
                if(result){
                  console.log();
                  resolve({msg:`${result}`,subdomain:`${result.subdomain}`})
                }
                else{
                    console.log('no data');
                }
              });
    
        } catch (error) {
            
        }
    })
        
    }).then(async (data)=>{
        // DB에 subdomain 값이 있음. subdomain값으로 다시 재연결요청
        console.log(data.msg);
        console.log('subdomain : ', data.subdomain);
        var tmpSubdomain2 = data.subdomain.toString();
        return await new Promise((resolve,reject)=>{
          http.get(`http://${globalVar.DOCKER_IP}:${globalVar.INTO_PORT}/api/tunneling?serialNo=${data.subdomain}`)

        }).then((data)=>{
            console.log('resolve');
        })
        
    })
    
    
