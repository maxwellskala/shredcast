const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const user = require('./routes/user');
const db = require('./db/models');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});
passport.use(new localStrategy(
  { usernameField: "email" },
  (email, password, done) => {
    db.User.findOne({
      where: {
        email: email
      }
    })
    .then((user) => {
      if (!user) {
        done(null, false);
      } else {
        bcrypt.compare(password, user.password, (err, res) => {
          res ? done(null, user) : done(null, false);
        });
      }
    })
    .catch((err) => done(err, null));
  }
));

const app = express();
app.set('port', (process.env.PORT || 3001));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const inProd = process.env.NODE_ENV === 'production';

if (inProd) {
  app.use(express.static('client/build'));
	pg.defaults.ssl = true;
}

const dbUrl = inProd 
	? process.env.DATABASE_URL
	: 'postgres://boilerplate:test@localhost/boilerplate_db';

// API endpoints
app.get('/api/test', user.test(pg, dbUrl));
app.post('/api/user/signup', user.signup(db.User));
app.post('/api/user/login', passport.authenticate('local'), user.login);

db.sequelize.sync().then(() => {
  app.listen(app.get('port'));
});
