const express = require('express');
const app = express();
const pg = require('pg');

app.set('port', (process.env.PORT || 3001));

const inProd = process.env.NODE_ENV === 'production';

if (inProd) {
  app.use(express.static('client/build'));
	pg.defaults.ssl = true;
}

const dbUrl = inProd 
	? process.env.DATABASE_URL
	: 'postgres://boilerplate:test@localhost/boilerplate_db';

app.get('/api/test', (req, res) => {
	console.log(dbUrl);
  pg.connect(dbUrl, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err) {
      	console.error(err); response.send("Error " + err);
      } else {
			  res.json({test: result.rows[0].test_column});
      }
    });
  });
});


app.listen(app.get('port'), () => {
	if (!inProd) {
  	console.log(`Find the server at: http://localhost:${app.get('port')}/`)
  };
});
