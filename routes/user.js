exports.test = (db, dbUrl) => (req, res) => {
  db.connect(dbUrl, (err, client, done) => {
    client.query('SELECT * FROM test_table', (err, result) => {
      done();
      if (err) {
        console.error(err); response.send("Error " + err);
      } else {
        res.json({ test: result.rows[0].test_column });
      }
    });
  });
};

exports.checkSession = (req, res) => {
  console.log(req.sessionID, '<- sessionId, checkSession');
  console.log(req.user, '<- req.user, checkSession');
  if (!req.user) {
    res.json({ user: false });
  } else {
    res.json({ user: req.user });
  }
};

exports.signup = (User) => (req, res) => {
  const { email, password } = req.body;
  User.create({
    email,
    password
  })
  .then((user) => res.json({ user }))
  .catch((err) => res.json({ err }));
};

exports.login = (req, res) => {
  console.log(req.sessionID, '<- sessionId, login');
  console.log(req.user, '<- req.user, login');
  return res.json({ user: req.user });
};

exports.logout = (req, res) => {
  console.log(req.sessionID, '<- sessionId, logout');
  console.log(req.user, '<- req.user, logout');
  if (!req.user) {
    res.json({ err: 'Already logged out!' });
  } else {
    req.logout();
    res.json({ success: 'Logged out!' });
  }
}
