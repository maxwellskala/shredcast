const express = require('express');
const app = express();
const pg = require('pg');
pg.defaults.ssl = true;

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));
}

app.get('/api/test', (req, res) => {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	console.log(process.env.DATABASE_URL, 'THIS IS THE DATABASE URL');
  	console.log(err);
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
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
