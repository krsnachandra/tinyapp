const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
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


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});