const passport = require("passport");
  const dotenv = require("dotenv");
  dotenv.config();
const User = require("../models/userModels");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.clientId,
    clientSecret:process.env.clientSecretKey,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done,) {
    console.log(profile);
  return done(null,profile)
// // database comes here 
// const user = await User.findOne({
//     googleId:profile.deserializeUser
// });
//  if(!user){
//    const newUser = await User.create({
//     googleId:profile.id,
//     name:profile.displayname,
//     photo:profile.photos[0].value
//    });
//    return done(null, newUser);
//  }
//  return done(null,user)

  }
 

));

passport.serializeUser(function(user,done){
    done(null,user)
});

passport.deserializeUser(function(obj,done){
    done(null,obj)
});