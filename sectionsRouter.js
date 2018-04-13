
'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {Section} = require('./models');

router.use(bodyParser.json());
router.use(express.static(__dirname + '/public'));

//==========================================================
router.get('/sections', (req, res) => {
	const queryOptions = ["subject", "coursenumber", "title","section","credithours","semester","startdate",
		 "enddate","starttime","endtime","sun","mon","tue","wed",
		 "thu","fri","sat","campus"];
	const queries = {};
	for (let i = 0; i< queryOptions.length; i++){
		if(req.query[queryOptions[i]]){
			queries[queryOptions[i]] = req.query[queryOptions[i]];
		};
	};

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

//search a course based on id
router.get('/sections/:id', (req, res) => {
	Section
		.findById(req.params.id)
		.then(section => res.json(section))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});


router.post('/sections', (req, res) =>{
	const requiredFields = ['subject', 'coursenumber', 'title', 'section','semester',
							'credithours', 'startdate', 'enddate',
							'starttime', 'endtime', 'sun', 'mon', 'tue', 'wed', 'thu',
							'fri', 'sat', 'campus', 'campuslat', 'campuslng', 'instructor'];
	for(let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)){
			const errorMessage = `Missing \`${field}\` in request body`;
			console.log(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}
	Section
		.create({
			semester: req.body.semester,
			subject: req.body.subject,
			coursenumber: req.body.coursenumber,
			title: req.body.title,
			section: req.body.section,
			credithours: req.body.credithours,
			startdate: req.body.startdate,
			enddate: req.body.enddate,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
			sun: req.body.sun,
			mon: req.body.mon,
			tue: req.body.tue,
			wed: req.body.wed,
			thu: req.body.thu,
			fri: req.body.fri,
			sat: req.body.sat,
			campus: req.body.campus,
			campuslat: req.body.campuslat,
			campuslng: req.body.campuslng,
			instructor: req.body.instructor
		})
		.then(section => res.status(200).json(section.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

router.delete('/sections/:id', (req, res) => {
  Section
    .findByIdAndRemove(req.params.id)
    .then(section => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//=============================================================

module.exports = router;
