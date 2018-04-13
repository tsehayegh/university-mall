'use strict';

const express = require('express');

const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config'); 
const {app, runServer, closeServer} = require('./serverConnection');
const {Section, Student, Cart} = require('./models');

const router = require('./sectionsRouter');
const studentsRouter = require('./studentsRouter');

//Sections router
app.use('/', router);

//Students router
app.use('/', studentsRouter);

//Requests made to non-existent endpoint
app.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});

//run server
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
