const express=require('express');
const mongoose =require('mongoose');
const bodyParser =require('body-parser');
const RwaModel=require('./Model/RWAModel');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
let port = process.env.port || 8080;


app.use(function (error,req,res,next) {

    res.status(error.status||500).json({message:error.message});


});

mongoose.connect('mongodb+srv://harry:Aer0plane@okhlee-jmpuh.mongodb.net/test?retryWrites=true', function (err) {
    if (err) throw err;
    else {
        console.log("Connected to database")
    }
});


//.......................<<<<<<>>>>>>>>>.............<<<<<<<<>>>>>>>>

app.post("/get_nearby_task", function (req, res) {


    RwaModel.nearBySocities(req, function (data) {

        res.send(data);
    })
});

app.post('/add_society',function (req,res) {

    RwaModel.addRwaSociety(req,function () {

        res.send({success:true,msg:"Record added successfully"})
    })

});

app.get('/get_societies',function (req,res) {

    RwaModel.getSocieties(req,res,function (data) {

        res.status(200).json(data);

    })
});

app.listen(port, function () {
    console.log('upload app listening on port 8080!');

});
