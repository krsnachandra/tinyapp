// Import statements
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

// Constants
const app = express();
const port = process.env.PORT || 8080; // default port 8080
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca",
    userID: "1" },
  "9sm5xK": { longURL: "http://www.google.com",
    userID: "2" }
};
const users = {
  "1": {
    id: "1",
    email: "user@example.com",
    password: "p"
  },
 "2": {
    id: "2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
function generateRandomString() {
  let string = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++)
    string += possible.charAt(Math.floor(Math.random() * possible.length));

  return string;
}
function emailInUsers(passedEmail){
  for (let userID in users) {
    if (users[userID].email === passedEmail) {
      return true;
    }
  }
}
function findUserByEmail(passedEmail){
    for (let userID in users) {
    if (users[userID].email === passedEmail) {
      return users[userID];
    }
  }
}
function urlsForUser(id, urlDatabase){
  let myURLs = {};
  for(let shortURL in urlDatabase) {
    if(urlDatabase[shortURL]['userID'] === id) {
      myURLs[shortURL] = urlDatabase[shortURL].longURL
    }
  }
  return myURLs;
}
const saltRounds = 10;


// Configuration
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 'session',
  keys: ["maybethisisakey"]
}));

// Routing
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
  };
  res.render("urls_register", templateVars);
});

// Register
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).send('400: Go back and enter a valid username, email, and password');
  } else if (emailInUsers(email)) {
    res.status(400).send('400: This email is already registered');
  } else {

    bcrypt.hash(password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      let randomId = generateRandomString();
      users[randomId] = {
        id: randomId,
        username: username,
        email: email,
        password: hash
      };
      req.session.user_id = randomId;
      res.redirect("/urls");
    })
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  const { username, email, password } = req.body;
  if (!emailInUsers(email)) {
    res.status(403).send('403: user with that e-mail cannot be found');
  } else {
    let user = findUserByEmail(email);
    if(!bcrypt.compareSync(password, user.password)) {
      res.status(403).send('403: password does not match');
    } else {
      req.session.user_id = user.id;
      res.redirect("/urls");
    }
  }
});

//Logout
app.post("/urls/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send('That is not yours!')
  }
});

app.get("/urls/new", (req, res) => {
  if (!(req.session.user_id)) {
    res.redirect("/login");
  } else {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id],
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL
    };
    res.render("urls_show", templateVars);
  }else {
    res.send('That is not yours!')
  }
});

// Below is where the update/edit magic happens:
app.post("/urls/:id", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
  } else {
    res.send('That is not yours!')
  }
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { "longURL": req.body.longURL,
    userID: req.session.user_id};
  res.redirect(`http://localhost:8080/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id]['longURL'];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});