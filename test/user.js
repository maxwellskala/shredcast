process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server');
const User = require('../db/models').User;

const VALIDATION_ERRORS = 'validationErrors';
const PARAM = 'param';

describe('routes/user', () => {
  beforeEach((done) => {
    User.destroy({
      where: {},
      truncate: true
    }).then(() => done());
  });

  describe('user.signup', () => {
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
    const testEmail = 'test@test.com';
    const testPassword = 'test';

    beforeEach((done) => {
      User.create({
        email: testEmail,
        password: testPassword
      }).then(() => done());
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
  });
});
