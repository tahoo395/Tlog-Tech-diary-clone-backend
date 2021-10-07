let passport = require('passport')
let googleStrategy = require('passport-google-oauth20').Strategy;
let User = require('../models/user')

require('dotenv').config()

passport.serializeUser((user, done) => {
    done(null , user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id)
    done(null , user)
})

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://za011b128-z699745d2-gtw.qovery.io/auth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        let currentUser = await User.findOne({ id: profile.id })
        if (!currentUser) {
            let newUser = await new User({
                id: profile.id,
                name: profile.displayName,
                username : profile.displayName.replace(' ' , '-').toLowerCase(),
                profilePic : profile._json.picture
            }).save()
            done(null , newUser)
        }
        else if (currentUser) {
            done(null , currentUser)
        }
    }
));
