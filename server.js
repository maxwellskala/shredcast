const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const user = require('./routes/user');
const db = require('./db/models');

const app = express();
app.set('port', (process.env.PORT || 3001));

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

const inProd = process.env.NODE_ENV === 'production';

if (inProd) {
  app.use(express.static('client/build'));
  pg.defaults.ssl = true;
}

const dbUrl = inProd 
  ? process.env.DATABASE_URL
  : 'postgres://boilerplate:test@localhost/boilerplate_db';

app.use(bodyParser.json());
app.use(cookieParser('mysecret'));
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: dbUrl
  }),
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// API endpoints
app.get('/api/user', user.checkSession);
app.post('/api/user/signup', user.signup(db.User));
app.post('/api/user/login', passport.authenticate('local'), user.login);
app.get('/api/user/logout', user.logout);

db.sequelize.sync().then(() => {
  app.listen(app.get('port'));
});
