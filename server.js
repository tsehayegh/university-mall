'use strict';

const express = require('express');



const {PORT, DATABASE_URL } = require('./config'); 
const {app, runServer, closeServer} = require('./serverConnection');
const {Section} = require('./models');

const router = require('./sectionsRouter');
const studentsRouter = require('./studentsRouter');


app.use('/', router);
app.use('/', studentsRouter);


/*
//open sever connection
function openSeverConnection(){
	return runServer(app, DATABASE_URL);
}

//close server connection
function closeSeverConnection(){
	return closeServer();
}
*/

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = {app, runServer, closeServer};
