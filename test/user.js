process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  'postgres://boilerplate:test@localhost/boilerplate_db_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server');
const User = require('../db/models').User;

const VALIDATION_ERRORS = 'validationErrors';
const PARAM = 'param';

describe('Books', () => {
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
  });
});
