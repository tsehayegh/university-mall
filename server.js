'use strict';

const express = require('express');

const mongoose = require('mongoose');

const {PORT, DATABASE_URL } = require('./config'); 
const {app, runServer, closeServer} = require('./serverConnection');
const {Section} = require('./models');


app.use(express.static('public'));


app.get('/sections', (req, res) => {
	Section
		.find()
		.then(sections => {
			res.send({
				sections: sections.map(
					(section) => section.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		})

});

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
