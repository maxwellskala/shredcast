exports.checkSession = (req, res) => {
  if (!req.user) {
    return res
      .status(204)
      .json({ user: false });
  } else {
    return res
      .status(200)
      .json({ user: req.user });
  }
};

exports.signup = (User) => (req, res) => {
  const { email, password } = req.body;
  User.create({
    email,
    password
  })
  .then((user) => res.status(201).json({ user }))
  .catch((err) => res.status(500).json({ err }));
};

exports.login = (req, res) => {
  return res
    .status(200)
    .json({ user: req.user });
};

exports.logout = (req, res) => {
  req.logout();
  return res
    .status(204)
    .json({ success: 'Logged out!' });
}
