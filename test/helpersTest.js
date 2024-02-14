// helpersTest.js

const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // User object is defined
    assert.isDefined(user, 'User object is defined');
    assert.equal(user.id, expectedUserID, 'Returned user ID should match the expected user ID');
    assert.equal(user.email, "user@example.com", 'Returned user email should match the expected user email');
    assert.equal(user.password, "purple-monkey-dinosaur", 'Returned user password should match the expected user password');
  });

  it('should return that user is undefined', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // User object is undefined
    // assert.isUndefined(user, 'User object is undefined');   
    assert.equal(user, undefined, 'User object is undefined');
  });
});