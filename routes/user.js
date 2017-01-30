exports.checkSession = (req, res) => {
  if (!req.user) {
    return res.json({ user: false });
  } else {
    return res.json({ user: req.user });
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
  return res.json({ user: req.user });
};

exports.logout = (req, res) => {
  req.logout();
  return res.json({ success: 'Logged out!' });
}
