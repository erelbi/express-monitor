const express = require('express');
const router = express.Router();
const path = require('path');
const redis = require('redis');
const client = redis.createClient('redis://127.0.0.1:6379');
var async = require('async');








router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/clients.html')); });

router.get('/all',(req,res) => {
    var jobs = [];
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);
        if(keys){
            async.map(keys, function(key, cb) {
               client.get(key, function (error, value) {
                    if (error) return cb(error);
                    var data = {};
                    data['hostname']=key;
                    cb(null, data);
                }); 
            }, function (error, results) {
               if (error) return console.log(error);
                    res.json({data:results});
            });
        }
    });
});


router.post('/', (req, res) => {
    var clients_info =  [{"ip":req.body.ip,"cpu":req.body.cpu,"tram":req.body.tram,"uram":req.body.uram}]
    // console.log(clients_info)
    
    req.redis.setex(req.body.hostname,2,JSON.stringify(clients_info));

    return res.json({success:'Client Online',status: 200})
});

router.get('/:hostname', (req, res) => {
    
    res.sendFile(path.join(__dirname + '/../public/html/info.html')); });


router.post('/:hostname', (req, res) => {
    req.redis.get(req.params.hostname, function(err, reply) {
        const obj = JSON.parse(reply);
        return res.json({info: obj,status: 200})
    });
  });


module.exports = router;
