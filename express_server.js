const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080
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
app.use(cookieParser());

// --------------- Objects -----------------------

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Create a global object called users which will be used to store and access the users in the app
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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


// ------------------- GET Methods -------------------
//Define the GET /register endpoint and to pass username to the register.ejs template
// Update the POST /register endpoint to handle registration errors
app.get('/register', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render('register', { user: user });
});


// Redirect root '/' to '/urls' for easy viewing
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect('/urls');
});

// GET /login endpoint to render the login form
app.get('/login', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render('login', {user: user});
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render("urls_new", { username: req.cookies["username"], user: user });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: user
  };
  res.render("urls_show", templateVars);
});

// update route handlers to pass the entire user object to urls_index
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = {
    user: user,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id; // This is how you get the 'id' from the route
  const longURL = urlDatabase[id]; // Use the 'id' to find the corresponding 'longURL' in your database

  if (longURL) {
    res.redirect(longURL); // Redirect to the 'longURL'
  } else {
    res.status(404).send("Short URL does not exist."); // Add error handling for non-existent short URLs
  }
});

//------------- POST Methods------------


// Define the POST /register endpoint
app.post('/register', (req, res) => {
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

  // Create a new user object
  const newUser = {
    id: userId,
    email: email,
    password: password
  };

  // Add the new user to the global users object
  users[userId] = newUser;

  // Set a user_id cookie containing the user's newly generated ID
  res.cookie('user_id', userId);

  // Redirect the user to the /urls page
  res.redirect('/urls');

  // Log the updated users object
  console.log('Updated users object:', users);
});


// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the username cookie
  res.clearCookie('user_id');
  // Redirect the user back to the /urls page
  res.redirect("/login");
});

app.post("/urls", (req, res) => {

  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`,); // Respond with 'Ok' (we will replace this)
});
// post Delete
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect(`/urls`); // Respond with 'Ok' (we will replace this)
});

// post Edit
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls`); // Respond with 'Ok' (we will replace this)
});

// post Redirect to Edit
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});

// POST /login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email); // Implement this function to find user by email

  if (!user || user.password !== password) {
    res.status(403).send("Invalid email or password");
    return;
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});