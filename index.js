const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require('./strategy');

const app = express();
app.use( session({
  secret: 'sup dude',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, {
    nickname: user.nickname,
    displayName: user.displayName,
    email: user.email
  })
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/login', passport.authenticate('auth0', {
  successRedirect: '/me',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/me', function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.status(200).send(JSON.stringify(req.user, null, 4));
  }
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
