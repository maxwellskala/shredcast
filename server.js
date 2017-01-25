const express = require('express');
const app = express();
const pg = require('pg');

const user = require('./routes/user');
const models = require('./models');

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

models.sequelize.sync().then(() => {
  app.listen(app.get('port'));
});
