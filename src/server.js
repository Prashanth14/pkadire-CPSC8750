// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cookieParser());

app.set('view engine', 'ejs');
// The main page of our website

let nextVisitorId = 1;
var last_visited, time_secs;

app.get('/', (req, res) => {
  

  if(req.cookies != undefined && req.cookies['visited'] != undefined){
     last_visited = req.cookies['visited'];
     secs = Math.floor((Date.now() - parseInt(last_visited))/1000);
     time_secs = 'It has been '+ secs + ' seconds since your last visit';
  }else{
    time_secs = 'You have never visited';
  }

  res.cookie('visitorId', nextVisitorId++);
  res.cookie('visited', Date.now().toString());
  
  // clearing the cookies manually
  // res.clearCookie('visited');

  res.render('welcome', {
    name: req.query.name || "World",
    visit_time:req.cookies.visited,
    VisitorId: req.cookies.visitorId,
    time: time_secs
  });

  console.log(req.cookies);
  
});

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
  
  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // console.log(content.results[0]);
  const question = content.results[0]['question'];
  let correct_ans = content.results[0]['correct_answer'];
  let incorrect_ans = content.results[0]['incorrect_answers'];
  let answers = incorrect_ans.concat(correct_ans);
  let difficulty = content.results[0]['difficulty'];
  let category = content.results[0]['category'];

 
  // fail if db failed
  // if (data.response_code !== 0) {
  //   res.status(500);
  //   res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
  //   return;
  // }

  // respond to the browser
  // TODO: make proper html
  res.render('trivia', {
    question: question,
    answers: answers,
    category: category,
    difficulty: difficulty,
    correct_ans:correct_ans,
  });

});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");