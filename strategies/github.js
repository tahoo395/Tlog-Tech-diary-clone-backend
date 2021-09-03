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
    callbackURL: "/auth/github/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile.id , profile.displayName , profile.photos[0].value)
        let currentUser = await User.findOne({ id: profile.id })
        if (!currentUser) {
            let newUser = await new User({
                id: profile.id,
                username: profile.displayName,
                profilePic : profile.photos[0].value
            }).save()
            done(null , newUser)
        }
        else if (currentUser) {
            done(null , currentUser)
        }
    }
));
