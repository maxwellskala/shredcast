exports.checkSession = (req, res) => {
  if (!req.user) {
    return res
      .status(200)
      .json({ user: false });
  } else {
    return res
      .status(200)
      .json({ user: req.user });
  }
};

exports.signup = (User) => (req, res) => {
  req.checkBody('email', 'Not a valid email address')
    .isEmail();
  req.checkBody('password', 'ASCII passwords only')
    .isAscii();
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return res
      .status(400)
      .json({ validationErrors });
  }

  const { email, password } = req.body;
  User.create({
    email,
    password
  })
  .then((user) => res.status(201).json({ user }))
  .catch((err) => res.status(500).json({ err }));
};

exports.login = (passport) => (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ err });
    }
    if (!user) {
      return res
        .status(401)
        .json({ errors: ['Invalid email or password'] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ err });
      }
      return res
        .status(200)
        .json({ user });
    });
  })(req, res);
};

exports.logout = (req, res) => {
  req.logout();
  return res
    .status(200)
    .json({ success: 'Logged out!' });
}
