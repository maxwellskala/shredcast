const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const pg = require('pg');

const user = require('./routes/user');
const db = require('./db/models');

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3001));

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
app.post('/api/user/login', user.login(db.User));

db.sequelize.sync().then(() => {
  app.listen(app.get('port'));
});
