const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
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