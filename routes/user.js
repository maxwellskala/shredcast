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
  const { email, password } = req.body;
  User.create({
    email,
    password
  })
  .then((user) => res.json({user}))
  .catch((err) => res.json({err}));
};

exports.login = (req, res) => {
  return res.json({user: req.user});
};
