let Router = require('express').Router()

let passport = require('passport')

Router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user)
  }
  else {
    res.sendStatus(401)
  }
})

Router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(process.env.FRONTEND)
})

Router.get('/github', passport.authenticate('github'));

Router.get('/github/callback', passport.authenticate('github' , {successRedirect : process.env.FRONTEND}))

Router.get('/google', passport.authenticate('google',  {scope: 'https://www.googleapis.com/auth/plus.login'} ));

Router.get('/google/callback', passport.authenticate('google'), {successRedirect : process.env.FRONTEND})
module.exports = Router