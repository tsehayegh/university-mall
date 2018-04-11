
'use strict';

//This module will create a connection to a server
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//import port, database configuration from config.js file
const {PORT, DATABASE_URL} = require('./config');
let server;

//A function to run (create connection) a server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

//A function to close a server (connection)
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

//Export app, runServer, and coloseServer modules
module.exports = {app, runServer, closeServer };


