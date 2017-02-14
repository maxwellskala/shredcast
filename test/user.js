process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server');
const User = require('../db/models').User;

const VALIDATION_ERRORS = 'validationErrors';
const PARAM = 'param';

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'test';

const destroyAllUsers = (done) => {
    User.destroy({
      truncate: true,
      cascade: true
    })
    .then(() => done())
    .catch((err) => done());
};

const createTestUser = (email, password, done) => {
  User.create({
    email,
    password
  })
  .then(() => {
    done();
  })
  .catch((err) => {
    done(err);
  });
};

describe('routes/user', () => {
  describe('user.checkSession', () => {
    before((done) => {
      createTestUser(TEST_EMAIL, TEST_PASSWORD, done);
    });

    after((done) => {
      destroyAllUsers(done);
    });

    it('returns no user if nobody logged in', (done) => {
      chai.request(app)
        .get('/api/user')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('user');
          expect(res.body.user).to.be.false;
          done();
        });
    });

    it('returns a user if they are logged in', (done) => {
      const loginCredentials = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      };
      chai.request(app)
        .post('/api/user/login')
        .send(loginCredentials)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('user');
          expect(res.body.user).to.exist;
          expect(res.body.user.email).to.equal(TEST_EMAIL);
          done();
        });
    });
  });

  describe('user.signup', () => {
    beforeEach((done) => {
      destroyAllUsers(done);
    });

    after((done) => {
      destroyAllUsers(done);
    });

    it('errors when given non-email as email parameter', (done) => {
      const badSignup = {
        email: 'notAnEmail',
        password: 'test'
      };
      chai.request(app)
        .post('/api/user/signup')
        .send(badSignup)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(VALIDATION_ERRORS);

          const validationErrors = res.body[VALIDATION_ERRORS];
          expect(validationErrors).to.be.an('array');
          expect(validationErrors.length).to.equal(1);
          expect(validationErrors[0][PARAM]).to.equal('email');
          done();
        });
    });

    it('errors when not given an email parameter', (done) => {
      const badSignup = {
        password: 'test'
      };
      chai.request(app)
        .post('/api/user/signup')
        .send(badSignup)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(VALIDATION_ERRORS);

          const validationErrors = res.body[VALIDATION_ERRORS];
          expect(validationErrors).to.be.an('array');
          expect(validationErrors.length).to.equal(1);
          expect(validationErrors[0][PARAM]).to.equal('email');
          done();
        });
    });

    it('errors when not given a password parameter', (done) => {
      const badSignup = {
        email: 'test@test.com'
      };
      chai.request(app)
        .post('/api/user/signup')
        .send(badSignup)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(VALIDATION_ERRORS);

          const validationErrors = res.body[VALIDATION_ERRORS];
          expect(validationErrors).to.be.an('array');
          expect(validationErrors.length).to.equal(1);
          expect(validationErrors[0][PARAM]).to.equal('password');
          done();
        });
    });

    it('creates a user in the database when parameters are valid', (done) => {
      User.findAll({
        where: {}
      }).then((users) => {
        expect(users.length).to.equal(0);
      });
      const validSignup = {
        email: 'test@test.com',
        password: 'test'
      };
      chai.request(app)
        .post('/api/user/signup')
        .send(validSignup)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.include.keys(VALIDATION_ERRORS);

          const returnedUser = res.body.user;
          expect(returnedUser.email).to.equal(validSignup.email);
          User.findAll({
            where: {}
          }).then((users) => {
            expect(users.length).to.equal(1);
            expect(users[0].dataValues.email).to.equal(validSignup.email);
            done();
          });
        });
    });
  });

  describe('user.login', () => {
    before((done) => {
      createTestUser(TEST_EMAIL, TEST_PASSWORD, done);
    });

    after((done) => {
      destroyAllUsers(done);
    });

    it('fails when an incorrect email is supplied', (done) => {
      const invalidLogin = {
        email: 'wrong@email.com',
        password: 'test'
      };
      chai.request(app)
        .post('/api/user/login')
        .send(invalidLogin)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.error).to.not.be.empty;
          done();
        });
    });

    it('fails when an incorrect password is supplied', (done) => {
      const invalidLogin = {
        email: 'test@email.com',
        password: 'notTest'
      };
      chai.request(app)
        .post('/api/user/login')
        .send(invalidLogin)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.error).to.not.be.empty;
          done();
        });
    });

    it('returns a user when correct credentials are supplied', (done) => {
      const validLogin = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      };
      chai.request(app)
        .post('/api/user/login')
        .send(validLogin)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.error).to.be.empty;
          expect(res.body).to.include.keys('user');
          const user = res.body.user;
          expect(user.email).to.equal(validLogin.email);
          done();
        });
    });
  });

  describe('user.logout', () => {
    before((done) => {
      createTestUser(TEST_EMAIL, TEST_EMAIL, done);
    });

    after((done) => {
      destroyAllUsers(done);
    });

    beforeEach((done) => {
      const loginCredentials = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      };
      chai.request(app)
        .post('/api/user/login')
        .send(loginCredentials)
        .end((err, res) => {
          done();
        });
    });

    it('doesn\'t error', (done) => {
      chai.request(app)
        .get('/api/user/logout')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.error).to.be.empty;
          done();
        });
    });
  });
});
