'use strict';

const express = require('express');



const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config'); 
const {app, runServer, closeServer} = require('./serverConnection');
const {Section, Student, Cart} = require('./models');

const router = require('./sectionsRouter');
const studentsRouter = require('./studentsRouter');


app.use('/', router);
app.use('/', studentsRouter);


//Catch requests made to non-existent endpoint
app.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});


//open sever connection
function openSeverConnection(){
	return runServer(app, DATABASE_URL);
}

//close server connection
function closeSeverConnection(){
	return closeServer();
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = {app, runServer, closeServer};
