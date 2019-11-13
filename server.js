const express = require('express');
const app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())
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
var uplaod = multer({storage:storage}).single('file');

// Set up the post route to uplaod the file

app.post('/upload',(req,res) => {
    upload(req,res,(err)=>{
        if(err instanceof multer.MulterError){
            return res.status(500).json(err);
        }else if(err){
            return res.status(500).json(err);
        }
        return res.status(200).send(req.file);
    })
});
app.listen(8000,() => {
    console.log('APP Running on 8000 port');
})
console.log('Hello world');