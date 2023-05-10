//jshint esversion:6
require('dotenv').config();
var express = require("express");
const bodyParser = require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const md5 =require("md5")
// const encrypt=require("mongoose-encryption");
// const { urlencoded } = require("body-parser");
var app = express();

console.log(md5("12345"));

// console.log(process.env.API_key);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/Node",{ useNewUrlParser:true});
// mongoose.set("userCreateIndex",true);

const userSchema=new mongoose.Schema({
    email: String,
    password: String,
    register:String,
    total:Number,
    fine:String,
});
const cashSchema=new mongoose.Schema({
    email: String,
    password: String
});

// const secret="thisiourlittlescecret."
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User= new mongoose.model("User",userSchema)
const Cash= new mongoose.model("Cash",cashSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/cashierregister",function(req,res){
    res.render("cashierregister");
});
app.get("/",function(req,res){
    res.render("home");
});
app.get("/cashier",function(req,res){
    res.render("cashier");
});
app.get("/cash",function(req,res){
    res.render("cash");
});

app.post("/register",function(req,res){
    
    const newUser=new User({
        email:req.body.username,
        password:md5(req.body.password),
        register:req.body.reg,
        total:0,
        fine:""

    });
    newUser.save().then(function (users) {
                    res.render("secrets")
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
});
app.post("/fine",function(req,res){
    
       let total=req.body.amount;
       let register=req.body.reg;
        let fine=req.body.fine;
    User.findOne({register:register}).updateOne({total:total}).updateOne({fine:fine})
.then(function (users) {
  res.render("cash")
  })
  .catch(function (err) {
    console.log(err);
  });
});
app.post("/edit",function(req,res){
    const email = req.body.username
    const password = md5(req.body.password)
       let register=req.body.reg;
        
    User.findOne({register:register}).updateOne({email:email}).updateOne({password:password})
.then(function (users) {
  res.render("secrets")
  })
  .catch(function (err) {
    console.log(err);
  });
});
app.post("/cashregister",function(req,res){
    
    const newCash=new Cash({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newCash.save().then(function (cashes) {
                    res.render("cash")
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
});


app.post("/login",function(req,res){
const username = req.body.username
const password = md5(req.body.password)

User.findOne({email:username})
.then(function (users) {
  if(users.password===password){
    res.render("secrets");
  }
  })
  .catch(function (err) {
    console.log(err);
  });
})
app.get('viewrecipes', function(req, res){
    User.find({})
    .then(function (users) {
        res.render("secrets",password);
      })
      .catch(function (err) {
        console.log(err);
      });
});
app.post("/cash",function(req,res){

    const username = req.body.username
const password = md5(req.body.password)

      Cash.findOne({email:username})
      .then(function (cashes) {
        if(cashes.password===password){
          res.render("cash");
        }
        })
        .catch(function (err) {
          console.log(err);
        });
      })
      


app.listen(3000, () => {
 console.log("Server running on port 3000");
});