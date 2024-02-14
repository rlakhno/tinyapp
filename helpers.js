// helpers.js

// Helper function to lookup user by email and user database
const getUserByEmail = function(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = {getUserByEmail};