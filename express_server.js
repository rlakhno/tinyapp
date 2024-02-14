
// express_server.js

const express = require("express");
const app = express();
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
// default port 8080
const PORT = 8080;
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));


const generateRandomString = function () {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

app.set("view engine", "ejs");
// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// --------------- Objects -----------------------


// Updated urlDatabase structure
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};


// Create a global object called users which will be used to store and access the users in the app
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    // password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
    password: "$2a$10$JmKWQ10g8UxI8w99zmAaiecYqvhCQCFrt1aYY79IBwzV6f9fDlmum"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    // password: bcrypt.hashSync("dishwasher-funk", 10)
    password: "$2a$10$w3Vg0dZ34PybcfHZzax5kuLvf1wmN4I47WVrUJu.q7RulcQCygrSG"
  },
  // Added user for testing purposes
  user3RandomID: {
    id: 'user3RandomID',
    email: 'user3@example.com',
    // password: bcrypt.hashSync("1111111", 10)
    password: '$2a$10$9n/BaR5ERZTOyVdyNNm3uOfj6K13ywgAmdYM0ZYk6JIOrgXgtlYj6'
  }
};

// ------------------ Functions -------------------------

// Helper function to lookup user by email
function getUserByEmail(email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

// Helper function which returns the URLs where the userID is equal to the id of the currently logged-in user.
const urlsForUser = function (userId) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userId) {
      userUrls[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return userUrls;
}


// ------------------- GET Methods -------------------
//Define the GET /register endpoint and to pass username to the register.ejs template
// Update the POST /register endpoint to handle registration errors
app.get('/register', (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  // Check if the user is already logged in, if yes, redirect to /urls
  if (user) {
    res.redirect('/urls');
  } else {
    res.render('register', { user: user });
  }
});


// GET /login endpoint to render the login form
app.get('/login', (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  // Check if the user is already logged in, if yes, redirect to /urls
  if (user) {
    res.redirect('/urls');
  } else {
    res.render('login', { user: user });
  }
});



// Redirect root '/' to '/urls' for easy viewing
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  // Check if the user is logged in
  if (!user) {
    // If not logged in, redirect to the login page
    res.redirect('/login');
  } else {
    res.render('urls_new', { user: user });
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



// GET route for "/urls/:id"
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const id = req.params.id;
  const url = urlDatabase[id];

  // Check if the URL exists in the database
  if (!url) {
    res.status(404).send("URL not found");
    return;
  }

  // Check if the user is logged in
  if (!userId) {
    // res.redirect("/login");
    res.status(401).send("You must be logged in to view this page.");
    return;
  }

  // Check if the URL belongs to the logged-in user
  if (url.userID !== userId) {
    res.status(403).send("You don't have permission to view this URL.");
    return;
  }

  const templateVars = {
    user: user,
    id: id,
    longURL: url.longURL
  };
  console.log("templateVars: ", templateVars);
  res.render("urls_show", templateVars);
});


// Update route handlers to pass the entire user object to urls_index
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const userUrls = urlsForUser(userId);
  console.log("userUrls: ", userUrls);

  const templateVars = {
    user: user,
    urls: userUrls
  };
  res.render("urls_index", templateVars);
});



app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('<html><body><h1>Shortened URL not found</h1></body></html>');
  }
});



//------------- POST Methods------------


// Define the POST /register endpoint
app.post('/register', (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for empty email or password fields
    if (!email || !password) {
      res.status(400).send('Email and password fields are required.');
      return;
    }

    // Check if the email already exists in the users object
    if (getUserByEmail(email)) {
      res.status(400).send('Email already exists.');
      return;
    }

    // Generate a random user ID
    const userId = generateRandomString();

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user object
    const newUser = {
      id: userId,
      email: email,
      password: hashedPassword
    };

    // Add the new user to the global users object
    users[userId] = newUser;

    // Set a user_id cookie containing the user's newly generated ID
    // res.cookie('user_id', userId);

      // Set user_id on session
      req.session.user_id = userId;

    // Redirect the user to the /urls page
    res.redirect('/urls');

    // Log the updated users object
    console.log('Updated users object:', users);

  } catch (error) {
    // Handle errors appropriately
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});


// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the username cookie
  // res.clearCookie('user_id');

  // Clear the user_id from session
  req.session = null;

  // Redirect the user back to the /urls page
  res.redirect("/login");
});

// POST /urls endpoint to handle URL creation
app.post('/urls', (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  // Check if the user is logged in
  if (!user) {
    // If not logged in, respond with an HTML message indicating why they cannot shorten URLs
    res.status(401).send('<html><body><h1>You must be logged in to shorten URLs</h1></body></html>');
  } else {
    // If logged in, proceed with URL creation
    const longURL = req.body.longURL;
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: longURL,
      userID: userId
    };
    res.redirect(`/urls/${id}`);
  }
});



// POST /urls/:id/delete - Delete a URL
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const url = urlDatabase[id];

  // Check if the URL ID exists
  if (!url) {
    res.status(404).send("URL not found");
    return;
  }

  // Check if the user is logged in
  if (!userId) {
    res.status(401).send("You must be logged in to delete this URL.");
    return;
  }

  // Check if the user owns the URL
  if (url.userID !== userId) {
    res.status(403).send("You don't have permission to delete this URL.");
    return;
  }

  // Delete the URL
  delete urlDatabase[id];
  res.redirect("/urls");
});


// POST /urls/:id - Update a URL
app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const longURL = req.body.longURL;
  const url = urlDatabase[id];

  // Check if the URL ID exists
  if (!url) {
    res.status(404).send("URL not found");
    return;
  }

  // Check if the user is logged in
  if (!userId) {
    res.status(401).send("You must be logged in to edit this URL.");
    return;
  }

  // Check if the user owns the URL
  if (url.userID !== userId) {
    res.status(403).send("You don't have permission to edit this URL.");
    return;
  }

  // Update the URL
  urlDatabase[id].longURL = longURL;
  res.redirect("/urls");
});


// post Redirect to Edit -------------------
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});

// POST /login endpoint -------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Implement this function to find user by email
  const user = getUserByEmail(email); 
  //   to use bcrypt to check the password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Invalid email or password");
    return;
  }

  // res.cookie("user_id", user.id);

  req.session.user_id = user.id;
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});