const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));


const generateRandomString = function() {
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

//Define the GET /register endpoint and to pass username to the register.ejs template
app.get('/register', (req, res) => {
  res.render('register', { username: req.cookies["username"] });
});

// Define the POST /register endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;
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
  res.clearCookie('username');
  // Redirect the user back to the /urls page
  res.redirect('/urls');
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies["username"] });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
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

// post Redirect to Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  if (!username) {
    res.redirect(`/urls`); // redirects to not to crash
  } else {
    res.cookie('username', username);
    console.log("username:", username);
    res.redirect(`/urls`); // Respond with 'Ok' (we will replace this)
  }

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



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});