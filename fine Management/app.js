var express = require("express");
const bodyParser = require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const session =require("express-session")
const passport=require("passport")
const passportlocalmongoose=require("passport-local-mongoose")
// const encrypt=require("mongoose-encryption");
// const { urlencoded } = require("body-parser");
var app = express();

// console.log(md5("12345"));

// console.log(process.env.API_key);


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: "our little secret.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/Node",{ useNewUrlParser:true});
// mongoose.set("userCreateIndex",true);

const userSchema=new mongoose.Schema({
    email: String,
    password: String
});
const cashSchema=new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportlocalmongoose);
// const secret="thisiourlittlescecret."
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User= new mongoose.model("User",userSchema);
const Cash= new mongoose.model("Cash",cashSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});
app.get("/cashier",function(req,res){
    res.render("cashier");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/logout",function(req,res){
    // req.logout();
    res.redirect("/");
});
app.get("/secrets",function (req,res) {
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login")
  }
})

app.post("/register",function(req,res){
  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
        
      })
    }
  })


  // bcrypt.hash(req.body.password,saltRounds,function(err,hash){
  //   const newUser=new User({
  //     email:req.body.username,
  //     password:hash
  // });
  //     newUser.save().then(function (users) {
  //                     res.render("secrets")
  //                   })
  //                   .catch(function (err) {
  //                     console.log(err);
  //                   });
  // })    
});


app.post("/login",function(req,res){

  const user=new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
      if(err){
        console.log(err);
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets")
        })
      }
    })
  })

    app.post("/cash",function(req,res){

      const user=new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user,function(err){
          if(username==="cash"){
            res.redirect("/cash")
          }else{
            console.log(err);            
          }
        })



  //       const email=req.body.username
//       const password=req.body.password
//       // console.log(password);
// User.findOne({email:email})
// .then(function(foundUser){
//         bcrypt.compare(password,foundUser.password,function(err,result){
//           if(result===true){
//             res.render("secrets");
//           }
//         })
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
})
 

app.listen(3000, () => {
 console.log("Server running on port 3000");
});