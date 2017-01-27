exports.test = (db, dbUrl) => (req, res) => {
  db.connect(dbUrl, (err, client, done) => {
    client.query('SELECT * FROM test_table', (err, result) => {
      done();
      if (err) {
        console.error(err); response.send("Error " + err);
      } else {
        res.json({test: result.rows[0].test_column});
      }
    });
  });
};

exports.signup = (User) => (req, res) => {
  return res.json({test: 'Hooray, it worked!'});
};

exports.login = (User) => (req, res) => {
  res.json({test: 'this is a stub endpoint'});
};
