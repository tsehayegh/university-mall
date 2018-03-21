
'use strict';

const express = require('express');
const studentsRouter = express.Router();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const {Student, Cart} = require('./models');

studentsRouter.use(bodyParser.json());

studentsRouter.use(express.static(__dirname + '/public'));

//==========================================================
//GET - Display student records 
studentsRouter.get('/students/:studentid', (req, res, next) => {
	Student
		.find({"studentid": req.params.studentid})
		.then(student => res.json(student))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//GET - based on query filters to check duplicate of registration
studentsRouter.get('/students', (req, res, next) => {
	const queryOptions = ["studentid", "subject", "coursenumber", "semester"];
	const queries = {};
	for (let i = 0; i< queryOptions.length; i++){
		if(req.query[queryOptions[i]]){
			queries[queryOptions[i]] = req.query[queryOptions[i]];
		};
	};
	Student
		.find(queries)
		.then(studentrecords => {
			res.send({
				studentrecords: studentrecords.map(
					(studentrecord) => studentrecord.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});


//===========================
//POST- Register for classes
studentsRouter.post('/students',(req, res) =>{
	const requiredFields = ['studentid', 'firstname', 'lastname', 'semester',
							'subject', 'coursenumber', 'title', 'section',
							'credithours', 'status', 'startdate', 'enddate',
							'starttime', 'endtime', 'campus'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const errorMessage = `Missing \`${field}\` in request body`;
			console.log(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}
	Student
		.create({
			studentid: req.body.studentid,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			semester: req.body.semester,
			subject: req.body.subject,
			coursenumber: req.body.coursenumber,
			title: req.body.title,
			section: req.body.section,
			credithours: req.body.credithours,
			grade: req.body.grade,
			status: req.body.status,
			startdate: req.body.startdate,
			enddate: req.body.enddate,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
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
		.then(student => res.status(200).json(student.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		})
});



//GET - pull sections/classes saved on Cart
studentsRouter.get('/search/cart', (req, res, next) => {
	const queryOptions = ["studentid", "subject", "coursenumber", "semester"];
	const queries = {};
	for (let i = 0; i< queryOptions.length; i++){
		if(req.query[queryOptions[i]]){
			queries[queryOptions[i]] = req.query[queryOptions[i]];
		};
	};
	console.log('queries to cart', queries)
	Cart
		.find(queries)
		.then(carts => {
			res.send({
				carts: carts.map(
					(cart) => cart.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//Save cart
studentsRouter.post('/students/cart',(req, res) =>{
	const requiredFields = ['studentid', 'firstname', 'lastname', 'semester',
							'subject', 'coursenumber', 'title', 'section',
							'credithours', 'status', 'startdate', 'enddate',
							'starttime', 'endtime', 'campus'];
	for(let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const errorMessage = `Missing \`${field}\` in request body`;
			console.log(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}
	Cart
		.create({
			studentid: req.body.studentid,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			semester: req.body.semester,
			subject: req.body.subject,
			coursenumber: req.body.coursenumber,
			title: req.body.title,
			section: req.body.section,
			credithours: req.body.credithours,
			grade: req.body.grade,
			status: req.body.status,
			startdate: req.body.startdate,
			enddate: req.body.enddate,
			starttime: req.body.starttime,
			endtime: req.body.endtime,
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
		.then(cart => res.status(200).json(cart.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal server error'});
		})
});

//======================

//PUT - use PUT method to update grades and status based on studentid and coursename


//DELETE - use DELETE method to delete registered class based on studentid and coursename

studentsRouter.delete('/delete/cart/:id', (req, res) => {
  Cart
    .findByIdAndRemove(req.params.id)
    .then(cart => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});



//Export module
module.exports = studentsRouter;