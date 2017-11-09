// Import statements
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Constants
const app = express();
const port = process.env.PORT || 8080; // default port 8080
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "1": {
    id: "1",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "2": {
    id: "2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
function generateRandomString() {
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    string += possible.charAt(Math.floor(Math.random() * possible.length));

  return string;
}

// Configuration
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Routing
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  // console.log(req.cookies['username']);
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  // console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// app.get("/urls", (req, res) => {
//   res.render("urls_index", { urls: urlDatabase,
//     username: req.cookies["username"]
//     }
//   );
// });

// Login
app.post("/urls/login", (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.body.username);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//Logout req.session = null
app.post("/urls/logout", (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.body.username);
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  // console.log([req.params.id]);  // debug statement to see POST parameters
  delete urlDatabase[req.params.id];
  // console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies['username']});
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['username']
  };
  res.render("urls_show", templateVars);
});

// Below is where the update magic happens:
app.post("/urls/:id", (req, res) => {
  // console.log(req.params.id);  // debug statement to see POST parameters
  // console.log(req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`http://localhost:8080/urls/${shortURL}`);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

// test method
// app.get("/test",(req,res)=>{
  // console.log("this is a test route I created and it works");
  // res.redirect("http://www.google.com");
  // res.send("OK. Its great that you are understanding it");
  // var person = {
  //   id: "101",
  //   name: "Chandra",
  //   job: "Technical Architect",
  //   salary: 90000000000
  // };

  // res.render("test", {data: person})
// });
/// test method ends here


app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});