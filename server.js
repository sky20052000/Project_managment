const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const passport = require("passport");
 require("./middleware/googlePassport");
// db connection 
const Connection = require("./database/connection");
Connection();
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors('*'));
app.use(cookieParser());
app.use(session({secret:"cats"
}));
app.use(passport.initialize());
app.use(passport.session())
/////////////// google login ///////////////////
function isLoggedIn(req,res,next){
    req.user ? next():res.sendStatus(401)
}

app.get("/",(req,res)=>{
    res.send('<a href="/auth/google">SIGN IN WITH GOOGLE</a>')
});

app.get("/auth/google",
passport.authenticate('google',{scope:["profile"]})
);

app.get("/google/callback",
     passport.authenticate('google',{
        successRedirect:"/protected",
        failureRedirect:"/auth/failure"
     })
);

// failure auth route
app.get("/auth/failure",(req,res)=>{
    res.send("Something went wrong!")
})


// protected route 
app.get("/protected",isLoggedIn,(req,res)=>{
    res.send(`Hurrah! Google login successfully done! ${req.user.displayName}`);
})

/// logout 
app.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

// set route 
app.use("/user", userRoute);
app.use("/product", productRoute);

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('That endpoint does not exist!'));
    });
});
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send({status:false,message:err.message}); 
});


app.listen(process.env.Port,()=>{
       console.log(`Server listening on the: ${process.env.Host}:${process.env.Port}`)
});
