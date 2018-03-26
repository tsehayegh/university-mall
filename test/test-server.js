'use strict';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config'); 
const {Section, Student, Cart} = require('../models');


//==================================


function generateRandomValues(arrayDocument){
	return arrayDocument[Math.floor(Math.random()*arrayDocument.length)];
}
//=======

const seedDocuments = {
	subject: ['eng', 'mat', 'phy', 'chm', 'bio'],
	title: ['Englis', 'Maths', 'Physics', 'Chemistry', 'Biology'],
	coursenumber: ['101', '111', '112', '113', '115', '121', '211', '215', '171'],
	section: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
	credithours: [3, 3.5, 2, 1, 4, 4.5, 2.5 ],
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
//=======
function seedSectionsData(){
	const seedData = [];
	for(let i = 1; i <= 10; i++){
		seedData.push(generateSectionsData());
	}
	return Section.insertMany(seedData);
}
//=======

function deleteDB(){
	return new Promise((resolve, reject)=>{
		Section.remove({}, function(err){
			console.log('Delete database');
		})
		.then((result) => resolve(resolve))
		.catch((err) => reject(err));
	});
}
//===================================================

describe('Testing class registration app, university-mall', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedSectionsData();
	});

	afterEach(function(){
		return deleteDB();
	});

	after(function(){
		return closeServer();
	})

	describe('GET sections endpoint', function(){

		it('should return all existing sections', function(){
			let res;
			return chai.request(app)
				.get('/sections')
				.then((_res) => {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.sections).to.have.lengthOf.at.least(1);
					return Section.count();
				})
				.then((count) => {
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

	

});








