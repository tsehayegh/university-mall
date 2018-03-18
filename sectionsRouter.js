
'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const {Section} = require('./models');

router.use(bodyParser.json());

router.use(express.static(__dirname + '/public'));

//==========================================================
//return all courses
router.use(function(req, res, next) {
  for (let key in req.query)
  { 
    req.query[key.toLowerCase()] = req.query[key];
  }
  next();
});
router.get('/sections', (req, res, next) => {
	const queryOptions = ["subject", "coursenumber", "title","section","credithours","semester","startdate",
		 "enddate","starttime","endtime","monday","tuesday","wednesday",
		 "thursday","friday","saturday","campus"];
	const queries = {};
	for (let i = 0; i< queryOptions.length; i++){
		if(req.query[queryOptions[i]]){
			queries[queryOptions[i]] = req.query[queryOptions[i]];
		};
	};
	console.log(queries);
	Section
		.find(queries)
		.then(sections => {
			res.send({
				sections: sections.map(
					(section) => section.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//search course based on query params
router.get('/sections/:campus?/:monday?', (req, res, next) => {
	const praramsOptions = ["subject", "coursenumber", "title","section","credithours","semester","startdate",
		 "enddate","starttime","endtime","monday","tuesday","wednesday",
		 "thursday","friday","saturday","campus"];
	const queryOptions = {};
	for (let i = 0; i< praramsOptions.length; i++){
		if(req.params[praramsOptions[i]]){
			queryOptions[praramsOptions[i]] = req.params[praramsOptions[i]];
		};
	};
	Section
		.find(queryOptions)
		.then(sections => {
			res.send({
				sections: sections.map(
					(section) => section.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//=============================================================

module.exports = router;
