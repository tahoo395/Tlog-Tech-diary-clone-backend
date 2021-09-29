let passport = require('passport')
let githubStrategy = require('passport-github').Strategy;
let User = require('../models/user')

require('dotenv').config()

passport.serializeUser((user, done) => {
    done(null , user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id)
    done(null , user)
})

passport.use(new githubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://za011b128-z699745d2-gtw.qovery.io/auth/github/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        let currentUser = await User.findOne({ id: profile.id })
        if (!currentUser) {
            let newUser = await new User({
                id: profile.id,
                name: profile.displayName,
                username : profile.username,
                profilePic : profile.photos[0].value
            }).save()
            done(null , newUser)
        }
        else if (currentUser) {
            done(null , currentUser)
        }
    }
));
