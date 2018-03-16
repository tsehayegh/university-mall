
'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const {Section} = require('./models');

router.use(bodyParser.json());

router.use(express.static('public'));

//==========================================================
//return all courses
router.get('/sections', (req, res, next) => {
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
		});
});

//search course based on query params
router.get('/sections/:campus', (req, res, next) => {
	Section
		.find({campus: req.params.campus})
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
