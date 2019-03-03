'use strict';

const http = require('http');
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const connection = require('./connection');

const index = require('./routes/index');

// db
connection.connect(function (err) {
  if(err){
    return console.log('error connecting:' + err.stack)
  }
  console.log('connected as id' + connection.threadId)
});
global.connection = connection;

// application
app.set(logger());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
// application curd
app.use(bodyParser.json());
// support x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// routing
app.use('/', index);
app.use((req, res, next) => {
  res.status('404');
  return res.render('error', {message: '404 Not Found'})
});

// server
const server = http.createServer(app);
server.listen('3000');
