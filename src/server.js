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
  
  // clearing cookies manually
  // res.clearCookie('visited');

  res.render('welcome', {
    name: req.query.name || "World",
    visit_time:req.cookies.visited,
    VisitorId: req.cookies.visitorId,
    time: time_secs
  });

  console.log(req.cookies);
  
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");