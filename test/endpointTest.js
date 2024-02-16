//endpointTest.js

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const agent = chai.request.agent('http://localhost:8080');

describe('Testing URL endpoints', () => {


  it('should redirect GET / to /login with status code 302', async () => {
    const agent = chai.request.agent('http://localhost:8080');

    return agent
    const res = await chai.request('http://localhost:8080').get('/');
    expect(res).to.redirect;
    expect(res).to.redirectTo('http://localhost:8080/login');
    expect(res).to.have.status(302);
  });

  it('should redirect GET / to /login with status 302', () => {
    return agent
      .get('/')
      .then((res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo('http://localhost:8080/login');
      });
  });


  it('should return status code 404 for GET /urls/NOTEXISTS', async () => {
    const res = await chai.request('http://localhost:8080').get('/urls/NOTEXISTS');
    expect(res).to.have.status(404);
  });

  it('should return status code 403 for GET /urls/b2xVn2', () => {
    const agent = chai.request.agent('http://localhost:8080');

    return agent
      .post('/login')
      .send({ email: 'user2@example.com', password: 'dishwasher-funk' })
      .then(loginRes => {
        return agent.get('/urls/b2xVn2').then(accessRes => {
          expect(accessRes).to.have.status(403);
        });
      });
  });
});
