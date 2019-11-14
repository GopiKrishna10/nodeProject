const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;
var multer = require('multer')
var cors = require('cors');
const myUrl = 'mongodb://localhost:27017';

var fs = require('fs');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))

MongoClient.connect(myUrl,{ useUnifiedTopology: true},(err,client) => {
    if(err) return console.log(err);
    db = client.db('uplaodFile');
    app.listen(8000,() => {
    console.log('APP Running on 8000 port');
})
})
// Create a multer instance and set the destination folder. The code below uses /public folder. You can also assign a new file name upon upload. The code below uses ‘originalfilename’as the file name.
var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'public');
    },
    fileName:(req,file,cb) => {
        cb(null,Date.now()+'-'+file.originalName);
    }
});
// Create an upload instance and receive a single file
var upload = multer({storage:storage}).array('file');

// Set up the post route to uplaod the file

app.post('/upload',(req,res) => {
    upload(req,res,(err)=>{
        var img = fs.readFileSync(req.files[0].path);
        var encode_image = img.toString('base64');
        var finalImage = {
            contentType:req.files[0].mimeType,
            image:new Buffer(encode_image, 'base64')
        }
        db.collection('mycollection').insertOne(finalImage,(err,result) => {
            console.log(result);
            if(err) return console.log(err,'error');
            console.log('Saved to DB');
            res.send(200);
        })
        // if(err instanceof multer.MulterError){
        //     return res.status(500).json(err);
        // }else if(err){
        //     return res.status(500).json(err);
        // }
        // return res.status(200).send(req.file);
    })
});
// geta all photos
app.get('/photos',(req,res) => {
    db.collection('mycollection').find().toArray((err,result) => {
        const imgArray = result.map(element => element.image);
        console.log(imgArray);
        if(err) return console.log('get Images err',err);
        res.send(imgArray);
    })
});
// get photos by id
app.get('/photo/:id',(req,res) => {
    let fileName = req.params.id;
    db.collection('mycollection').findOne({'_id':ObjectId(fileName)},(err,result) => {
        if(err) return console.log('error in getImagebyId',err);
        res.contentType('image/jpeg');
        res.send(result.image.buffer);
    })
})

console.log('Hello world');