'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const expect = chai.expect;
mongoose.Promise = global.Promise;

const { app, runServer, closeServer } = require('../server');
const {TEST_DATABASE_URL, DATABASE_URL} = require('../config'); 
const {Section, Student, Cart} = require('../models');

chai.use(chaiHttp);

//==================================
function generateRandomValues(arrayDocument){
	return arrayDocument[Math.floor(Math.random()*arrayDocument.length)];
}
//=======
const seedDocuments = {
	studentid: ['001', '002','003', '004','005','006','007','008','009','010'],
	subject: ['eng', 'mat', 'phy', 'chm', 'bio'],
	title: ['Englis', 'Maths', 'Physics', 'Chemistry', 'Biology'],
	coursenumber: ['101', '111', '112', '113', '115', '121', '211', '215', '171'],
	section: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
	credithours: [3, 3.5, 2, 1, 4, 4.5, 2.5 ],
	grade: ['A', 'B', 'C', 'D', 'F', 'I', 'W'],
	status: ['reg', 'cart'],
	semester: ['2018SP', '2018SU', '2018FA', '2019SP', '2019SU', '2019SU', '2019FA'],
	startdate: ["08/15/2018", "08/20/2018"],
	enddate: ["12/11/2018", "12/20/2018"],
	starttime: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
				"01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
	endtime: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
			"01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
	sun: [null, 'Y'],
	mon: [null, 'Y'],
	tue: [null, 'Y'],
	wed: [null, 'Y'],
	thu: [null, 'Y'],
	fri: [null, 'Y'],
	sat: [null, 'Y'],
	campus: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
	campuslat: [35.106732, 35.265033, 35.217403, 35.129569, 35.215848, 35.392813],
	campuslng: [-80.693891, -80.731100, -80.830469, -80.895581,-80.919328,-80.840550],
	instructor: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
}

function generateSectionsData() {
  return {
	subject: generateRandomValues(seedDocuments.subject),
	title: generateRandomValues(seedDocuments.title),
	coursenumber: generateRandomValues(seedDocuments.coursenumber),
	section: generateRandomValues(seedDocuments.section),
	credithours: generateRandomValues(seedDocuments.credithours),
	semester: generateRandomValues(seedDocuments.semester),
	startdate: generateRandomValues(seedDocuments.startdate),
	enddate: generateRandomValues(seedDocuments.enddate),
	starttime: generateRandomValues(seedDocuments.starttime),
	endtime: generateRandomValues(seedDocuments.starttime),
	sun: generateRandomValues(seedDocuments.sun),
	mon: generateRandomValues(seedDocuments.mon),
	tue: generateRandomValues(seedDocuments.tue),
	wed: generateRandomValues(seedDocuments.wed),
	thu: generateRandomValues(seedDocuments.thu),
	fri: generateRandomValues(seedDocuments.fri),
	sat: generateRandomValues(seedDocuments.sat),
	campus: generateRandomValues(seedDocuments.campus),
	campuslat: generateRandomValues(seedDocuments.campuslat),
	campuslng: generateRandomValues(seedDocuments.campuslng),
	instructor: generateRandomValues(seedDocuments.instructor)
  };
}

function generateStudentsData() {
  return {
  	studentid: generateRandomValues(seedDocuments.studentid),
  	firstname: faker.name.firstName(),
  	lastname: faker.name.lastName(),
	subject: generateRandomValues(seedDocuments.subject),
	title: generateRandomValues(seedDocuments.title),
	coursenumber: generateRandomValues(seedDocuments.coursenumber),
	section: generateRandomValues(seedDocuments.section),
	credithours: generateRandomValues(seedDocuments.credithours),
	grade: generateRandomValues(seedDocuments.grade),
	status: generateRandomValues(seedDocuments.status),
	semester: generateRandomValues(seedDocuments.semester),
	startdate: generateRandomValues(seedDocuments.startdate),
	enddate: generateRandomValues(seedDocuments.enddate),
	starttime: generateRandomValues(seedDocuments.starttime),
	endtime: generateRandomValues(seedDocuments.starttime),
	sun: generateRandomValues(seedDocuments.sun),
	mon: generateRandomValues(seedDocuments.mon),
	tue: generateRandomValues(seedDocuments.tue),
	wed: generateRandomValues(seedDocuments.wed),
	thu: generateRandomValues(seedDocuments.thu),
	fri: generateRandomValues(seedDocuments.fri),
	sat: generateRandomValues(seedDocuments.sat),
	campus: generateRandomValues(seedDocuments.campus),
	campuslat: generateRandomValues(seedDocuments.campuslat),
	campuslng: generateRandomValues(seedDocuments.campuslng),
	instructor: generateRandomValues(seedDocuments.instructor)
  };
}

//=======
function seedSectionsData(){
	const seedData = [];
	for(let i = 1; i <= 10; i++){
		seedData.push(generateSectionsData());
	}
	return Section.insertMany(seedData);
}

//=======
function seedStudentsData(){
	const seedData = [];
	for(let i = 1; i <= 10; i++){
		seedData.push(generateStudentsData());
	}
	return Student.insertMany(seedData);
}
//=======
function seedCartData(){
	const seedData = [];
	for(let i = 1; i <= 10; i++){
		seedData.push(generateStudentsData());
	}
	return Cart.insertMany(seedData);
}



//=======
function seedData(){
	seedSectionsData();
	seedStudentsData();
	seedCartData();
}

//=======
function deleteSectionsDB(){
	return new Promise((resolve, reject)=>{
		Section.remove({}, function(err){
			console.log('Delete database');
		})
		.then((result) => resolve(resolve))
		.catch((err) => reject(err));
	});
}

//=======
function deleteStudentsDB(){
	return new Promise((resolve, reject) => {
		Student.remove({}, function(err){
		})
		.then((result) => resolve(resolve))
		.catch((err) => reject(err));
	});
}

//=======
function deleteCartDB(){
	return new Promise((resolve, reject) => {
		Cart.remove({}, function(err){
		})
		.then((result) => resolve(resolve))
		.catch((err) => reject(err));
	});
}


//=======
function deleteDB(){
	deleteSectionsDB();
	deleteStudentsDB();
	deleteCartDB();
}


//===================================================
describe('Testing class registration app, university-mall', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedData();
	});
	afterEach(function(){
		return deleteDB();
	});
	after(function(){
		return closeServer();
	});
	
	describe('GET endpoint - sections', function(){
		this.timeout(5000);

		it('should return all existing sections', function(){

			let res;
			return chai.request(app)
				.get('/sections')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					return Section.count();
				})
				.then(function(count) {
					expect(res.body.sections).to.have.lengthOf(count);
				});
		});
		
		it('should return sections with right fields', function(){

			let resSection;
			return chai.request(app)
				.get('/sections')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res.body.sections).to.be.a('array');
					expect(res.body.sections).to.have.lengthOf.at.least(1);
					res.body.sections.forEach(function(section) {
						expect(section).to.be.a('object');
						expect(section).to.include.keys(
							'id', 'subject', 'title', 'coursenumber', 'section',
							'credithours', 'semester', 'startdate', 'enddate', 
							'starttime', 'endtime', 'sun','mon', 'tue', 'wed',
							'thu', 'fri', 'sat', 'campus', 'campuslat', 'campuslng',
							'instructor'
							);
					});
					resSection = res.body.sections[0];
					return Section.findById(resSection.id);
				})
				.then(function(section) {
					expect(resSection.id).to.equal(section.id);
					expect(resSection.subject).to.equal(section.subject);
					expect(resSection.title).to.equal(section.title);
					expect(resSection.coursenumber).to.equal(section.coursenumber);
					expect(resSection.section).to.equal(section.section);
					expect(resSection.credithours).to.equal(section.credithours);
					expect(resSection.semester).to.equal(section.semester);
					expect(resSection.startdate).to.equal(section.startdate);
					expect(resSection.enddate).to.equal(section.enddate);
					expect(resSection.starttime).to.equal(section.starttime);
					expect(resSection.endtime).to.equal(section.endtime);
					expect(resSection.sun).to.equal(section.sun);
					expect(resSection.mon).to.equal(section.mon);
					expect(resSection.tue).to.equal(section.tue);
					expect(resSection.wed).to.equal(section.wed);
					expect(resSection.thu).to.equal(section.thu);
					expect(resSection.fri).to.equal(section.fri);
					expect(resSection.sat).to.equal(section.sat);
					expect(resSection.campus).to.equal(section.campus);
					expect(resSection.campuslat).to.equal(section.campuslat);
					expect(resSection.campuslng).to.equal(section.campuslng);
					expect(resSection.instructor).to.equal(section.instructor);
				});
		});

	});

	describe('POST endpoint - sections', function(){
		it('should add a new section', function(){
			const newSection =  generateSectionsData();
			return chai.request(app)
				.post('/sections')
				.send(newSection)
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.have.include.keys(
						'id', 'subject', 'title', 'coursenumber', 'section',
						'credithours', 'semester', 'startdate', 'enddate',
						'starttime', 'endtime', 'sun', 'mon', 'tue', 'wed',
						'thu', 'fri', 'sat', 'campus', 'campuslat', 'campuslng',
						'instructor');
					expect(res.body.id).to.not.be.null;
					expect(res.body.subject).to.equal(newSection.subject);
					expect(res.body.title).to.equal(newSection.title);
					expect(res.body.coursenumber).to.equal(newSection.coursenumber);
					expect(res.body.section).to.equal(newSection.section);
					expect(res.body.credithours).to.equal(newSection.credithours);
					expect(res.body.semester).to.equal(newSection.semester);
					expect(res.body.startdate).to.equal(newSection.startdate);
					expect(res.body.enddate).to.equal(newSection.enddate);
					expect(res.body.starttime).to.equal(newSection.starttime);
					expect(res.body.endtime).to.equal(newSection.endtime);
					expect(res.body.sun).to.equal(newSection.sun);
					expect(res.body.mon).to.equal(newSection.mon);
					expect(res.body.tue).to.equal(newSection.tue);
					expect(res.body.wed).to.equal(newSection.wed);
					expect(res.body.thu).to.equal(newSection.thu);
					expect(res.body.fri).to.equal(newSection.fri);
					expect(res.body.sat).to.equal(newSection.sat);
					expect(res.body.campus).to.equal(newSection.campus);
					expect(res.body.campuslat).to.equal(newSection.campuslat);
					expect(res.body.campuslng).to.equal(newSection.campuslng);
					expect(res.body.instructor).to.equal(newSection.instructor);
				});
		});
	});

		describe('DELETE endpoint - sections', function(){
		it('delete selected section by id', function(){
			let section;
			return Section
				.findOne()
				.then(function(_section){
					section = _section;
					return chai.request(app).delete(`/sections/${section.id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Section.findById(section.id);
				})
				.then(function(_section) {
					expect(_section).to.be.null;
				});
		});
	});


	describe('GET endpoint - students', function(){

		it('should return all students records', function(){
			let res;
			return chai.request(app)
				.get('/students')
				.then((_res) => {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.studentrecords).to.be.a('array');
					expect(res.body.studentrecords).to.have.lengthOf.at.least(1);
					return Student.count();
				})
				.then((count) => {
					expect(res.body.studentrecords).to.have.lengthOf(count);
				});
		});

		it('should return students with right fields', function(){
			let resStudent;
			return chai.request(app)
				.get('/students')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res.body.studentrecords).to.be.a('array');
					expect(res.body.studentrecords).to.have.lengthOf.at.least(1);
					res.body.studentrecords.forEach(function(student) {
						expect(student).to.be.a('object');
						expect(student).to.include.keys(
							'id', 'studentid', 'fullname', 'subject', 'title', 
							'coursenumber', 'section', 'credithours', 'grade', 'status', 
							'semester', 'startdate', 'enddate','starttime', 'endtime', 
							'sun','mon', 'tue', 'wed','thu', 'fri', 'sat', 'campus', 
							'campuslat', 'campuslng','instructor'
							);
					});
					resStudent = res.body.studentrecords[0];
					return Student.findById(resStudent.id);
				})
				.then(function(student) {
					expect(resStudent.id).to.equal(student.id);
					expect(resStudent.fullname).to.equal(student.fullname);
					expect(resStudent.subject).to.equal(student.subject);
					expect(resStudent.title).to.equal(student.title);
					expect(resStudent.coursenumber).to.equal(student.coursenumber);
					expect(resStudent.section).to.equal(student.section);
					expect(resStudent.credithours).to.equal(student.credithours);
					expect(resStudent.grade).to.equal(student.grade);
					expect(resStudent.status).to.equal(student.status);
					expect(resStudent.semester).to.equal(student.semester);
					expect(resStudent.startdate).to.equal(student.startdate);
					expect(resStudent.enddate).to.equal(student.enddate);
					expect(resStudent.starttime).to.equal(student.starttime);
					expect(resStudent.endtime).to.equal(student.endtime);
					expect(resStudent.sun).to.equal(student.sun);
					expect(resStudent.mon).to.equal(student.mon);
					expect(resStudent.tue).to.equal(student.tue);
					expect(resStudent.wed).to.equal(student.wed);
					expect(resStudent.thu).to.equal(student.thu);
					expect(resStudent.fri).to.equal(student.fri);
					expect(resStudent.sat).to.equal(student.sat);
					expect(resStudent.campus).to.equal(student.campus);
					expect(resStudent.campuslat).to.equal(student.campuslat);
					expect(resStudent.campuslng).to.equal(student.campuslng);
					expect(resStudent.instructor).to.equal(student.instructor);
				});
		});
	});


	describe('POST endpoint - students', function(){
		it('should add new student record', function(){
			const newStudent = generateStudentsData();
			let fullname;
			return chai.request(app)
				.post('/students')
				.send(newStudent)
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys(
							'id', 'studentid', 'fullname', 'subject', 'title', 
							'coursenumber', 'section', 'credithours', 'grade', 'status', 
							'semester', 'startdate', 'enddate','starttime', 'endtime', 
							'sun','mon', 'tue', 'wed','thu', 'fri', 'sat', 'campus', 
							'campuslat', 'campuslng','instructor');
					fullname = newStudent.firstname + " " + newStudent.lastname;
					expect(res.body.id).to.not.be.null;
					expect(res.body.fullname).to.equal(fullname);
					expect(res.body.subject).to.equal(newStudent.subject);
					expect(res.body.title).to.equal(newStudent.title);
					expect(res.body.coursenumber).to.equal(newStudent.coursenumber);
					expect(res.body.section).to.equal(newStudent.section);
					expect(res.body.credithours).to.equal(newStudent.credithours);
					expect(res.body.grade).to.equal(newStudent.grade);
					expect(res.body.status).to.equal(newStudent.status);
					expect(res.body.semester).to.equal(newStudent.semester);
					expect(res.body.startdate).to.equal(newStudent.startdate);
					expect(res.body.enddate).to.equal(newStudent.enddate);
					expect(res.body.starttime).to.equal(newStudent.starttime);
					expect(res.body.endtime).to.equal(newStudent.endtime);
					expect(res.body.sun).to.equal(newStudent.sun);
					expect(res.body.mon).to.equal(newStudent.mon);
					expect(res.body.tue).to.equal(newStudent.tue);
					expect(res.body.wed).to.equal(newStudent.wed);
					expect(res.body.thu).to.equal(newStudent.thu);
					expect(res.body.fri).to.equal(newStudent.fri);
					expect(res.body.sat).to.equal(newStudent.sat);
					expect(res.body.campus).to.equal(newStudent.campus);
					expect(res.body.campuslat).to.equal(newStudent.campuslat);
					expect(res.body.campuslng).to.equal(newStudent.campuslng);
					expect(res.body.instructor).to.equal(newStudent.instructor);

					return Student.findById(res.body.id);
				})
				.then(function(studen){
					expect(studen.fullname).to.equal(fullname);
					expect(studen.subject).to.equal(newStudent.subject);
					expect(studen.title).to.equal(newStudent.title);
					expect(studen.coursenumber).to.equal(newStudent.coursenumber);
					expect(studen.section).to.equal(newStudent.section);
					expect(studen.credithours).to.equal(newStudent.credithours);
					expect(studen.grade).to.equal(newStudent.grade);
					expect(studen.status).to.equal(newStudent.status);
					expect(studen.semester).to.equal(newStudent.semester);
					expect(studen.startdate).to.equal(newStudent.startdate);
					expect(studen.enddate).to.equal(newStudent.enddate);
					expect(studen.starttime).to.equal(newStudent.starttime);
					expect(studen.endtime).to.equal(newStudent.endtime);
					expect(studen.sun).to.equal(newStudent.sun);
					expect(studen.mon).to.equal(newStudent.mon);
					expect(studen.tue).to.equal(newStudent.tue);
					expect(studen.wed).to.equal(newStudent.wed);
					expect(studen.thu).to.equal(newStudent.thu);
					expect(studen.fri).to.equal(newStudent.fri);
					expect(studen.sat).to.equal(newStudent.sat);
					expect(studen.campus).to.equal(newStudent.campus);
					expect(studen.campuslat).to.equal(newStudent.campuslat);
					expect(studen.campuslng).to.equal(newStudent.campuslng);
					expect(studen.instructor).to.equal(newStudent.instructor);
				});
		});
	});

	describe('PUT endpoint - students', function(){
		it('should update fields you send over', function(){
			const updateData ={
					grade: 'B',
					status: 'cmpl'
				};
			return Student
				.findOne()
				.then(function(student){
					updateData.id = student.id;
					return chai.request(app)
						.put(`/students/${student.id}`)
						.send(updateData) 
				})
				.then(function(res){
					expect(res).to.have.status(204);
					return Student.findById(updateData.id);
				})
				.then(function(student){
					expect(student.grade).to.equal(updateData.grade);
					expect(student.status).to.equal(updateData.status);
				})	
		});
	});


	describe('DELETE endpoint - students', function(){
		it('delete selected student record', function(){
			let student;
			return Student
				.findOne()
				.then(function(_student){
					student = _student;
					return chai.request(app).delete(`/students/${student.id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Student.findById(student.id);
				})
				.then(function(_student) {
					expect(_student).to.be.null;
				});
		});
	});

	describe('GET endpoint - cart', function(){
		it('should return all cart records', function(){
			let res;
			return chai.request(app)
				.get('/search/cart')
				.then((_res) => {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.carts).to.be.a('array');
					expect(res.body.carts).to.have.lengthOf.at.least(1);
					return Student.count();
				})
				.then((count) => {
					expect(res.body.carts).to.have.lengthOf(count);
				});
		});

		it('should return carts with right fields', function(){
			let resStudent;
			return chai.request(app)
				.get('/search/cart')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res.body.carts).to.be.a('array');
					expect(res.body.carts).to.have.lengthOf.at.least(1);
					res.body.carts.forEach(function(student) {
						expect(student).to.be.a('object');
						expect(student).to.include.keys(
							'id', 'studentid', 'fullname', 'subject', 'title', 
							'coursenumber', 'section', 'credithours', 'grade', 'status', 
							'semester', 'startdate', 'enddate','starttime', 'endtime', 
							'sun','mon', 'tue', 'wed','thu', 'fri', 'sat', 'campus', 
							'campuslat', 'campuslng','instructor'
							);
					});
					resStudent = res.body.carts[0];
					return Cart.findById(resStudent.id);
				})
				.then(function(student) {
					expect(resStudent.id).to.equal(student.id);
					expect(resStudent.fullname).to.equal(student.fullname);
					expect(resStudent.subject).to.equal(student.subject);
					expect(resStudent.title).to.equal(student.title);
					expect(resStudent.coursenumber).to.equal(student.coursenumber);
					expect(resStudent.section).to.equal(student.section);
					expect(resStudent.credithours).to.equal(student.credithours);
					expect(resStudent.grade).to.equal(student.grade);
					expect(resStudent.status).to.equal(student.status);
					expect(resStudent.semester).to.equal(student.semester);
					expect(resStudent.startdate).to.equal(student.startdate);
					expect(resStudent.enddate).to.equal(student.enddate);
					expect(resStudent.starttime).to.equal(student.starttime);
					expect(resStudent.endtime).to.equal(student.endtime);
					expect(resStudent.sun).to.equal(student.sun);
					expect(resStudent.mon).to.equal(student.mon);
					expect(resStudent.tue).to.equal(student.tue);
					expect(resStudent.wed).to.equal(student.wed);
					expect(resStudent.thu).to.equal(student.thu);
					expect(resStudent.fri).to.equal(student.fri);
					expect(resStudent.sat).to.equal(student.sat);
					expect(resStudent.campus).to.equal(student.campus);
					expect(resStudent.campuslat).to.equal(student.campuslat);
					expect(resStudent.campuslng).to.equal(student.campuslng);
					expect(resStudent.instructor).to.equal(student.instructor);
				});
		});
	});

	describe('POST endpoint - cart', function(){
		it('should add new student record to cart', function(){
			const newStudent = generateStudentsData();
			let fullname;
			return chai.request(app)
				.post('/students/cart')
				.send(newStudent)
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys(
							'id', 'studentid', 'fullname', 'subject', 'title', 
							'coursenumber', 'section', 'credithours', 'grade', 'status', 
							'semester', 'startdate', 'enddate','starttime', 'endtime', 
							'sun','mon', 'tue', 'wed','thu', 'fri', 'sat', 'campus', 
							'campuslat', 'campuslng','instructor');
					fullname = newStudent.firstname + " " + newStudent.lastname;
					expect(res.body.id).to.not.be.null;
					expect(res.body.fullname).to.equal(fullname);
					expect(res.body.subject).to.equal(newStudent.subject);
					expect(res.body.title).to.equal(newStudent.title);
					expect(res.body.coursenumber).to.equal(newStudent.coursenumber);
					expect(res.body.section).to.equal(newStudent.section);
					expect(res.body.credithours).to.equal(newStudent.credithours);
					expect(res.body.grade).to.equal(newStudent.grade);
					expect(res.body.status).to.equal(newStudent.status);
					expect(res.body.semester).to.equal(newStudent.semester);
					expect(res.body.startdate).to.equal(newStudent.startdate);
					expect(res.body.enddate).to.equal(newStudent.enddate);
					expect(res.body.starttime).to.equal(newStudent.starttime);
					expect(res.body.endtime).to.equal(newStudent.endtime);
					expect(res.body.sun).to.equal(newStudent.sun);
					expect(res.body.mon).to.equal(newStudent.mon);
					expect(res.body.tue).to.equal(newStudent.tue);
					expect(res.body.wed).to.equal(newStudent.wed);
					expect(res.body.thu).to.equal(newStudent.thu);
					expect(res.body.fri).to.equal(newStudent.fri);
					expect(res.body.sat).to.equal(newStudent.sat);
					expect(res.body.campus).to.equal(newStudent.campus);
					expect(res.body.campuslat).to.equal(newStudent.campuslat);
					expect(res.body.campuslng).to.equal(newStudent.campuslng);
					expect(res.body.instructor).to.equal(newStudent.instructor);

					return Cart.findById(res.body.id);
				})
				.then(function(studen){
					expect(studen.fullname).to.equal(fullname);
					expect(studen.subject).to.equal(newStudent.subject);
					expect(studen.title).to.equal(newStudent.title);
					expect(studen.coursenumber).to.equal(newStudent.coursenumber);
					expect(studen.section).to.equal(newStudent.section);
					expect(studen.credithours).to.equal(newStudent.credithours);
					expect(studen.grade).to.equal(newStudent.grade);
					expect(studen.status).to.equal(newStudent.status);
					expect(studen.semester).to.equal(newStudent.semester);
					expect(studen.startdate).to.equal(newStudent.startdate);
					expect(studen.enddate).to.equal(newStudent.enddate);
					expect(studen.starttime).to.equal(newStudent.starttime);
					expect(studen.endtime).to.equal(newStudent.endtime);
					expect(studen.sun).to.equal(newStudent.sun);
					expect(studen.mon).to.equal(newStudent.mon);
					expect(studen.tue).to.equal(newStudent.tue);
					expect(studen.wed).to.equal(newStudent.wed);
					expect(studen.thu).to.equal(newStudent.thu);
					expect(studen.fri).to.equal(newStudent.fri);
					expect(studen.sat).to.equal(newStudent.sat);
					expect(studen.campus).to.equal(newStudent.campus);
					expect(studen.campuslat).to.equal(newStudent.campuslat);
					expect(studen.campuslng).to.equal(newStudent.campuslng);
					expect(studen.instructor).to.equal(newStudent.instructor);
				});
		});
	});

	describe('DELETE endpoint - cart', function(){
		it('delete selected cart record', function(){
			let cart;
			return Cart
				.findOne()
				.then(function(_cart){
					cart = _cart;
					return chai.request(app).delete(`/search/cart/${cart.id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Cart.findById(cart.id);
				})
				.then(function(_cart) {
					expect(_cart).to.be.null;
				});
		});
	});

});








