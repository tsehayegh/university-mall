'use strict';

const mongoose = require('mongoose');

//schema to represent sections
const sectionsSchema = mongoose.Schema({
	"subject": {type: String, required: true},
	"coursenumber": {type: String, required: true},
	"title": {type: String, required: true},
	"section": {type: String, required: true},
	"credithours": {type: Number, required: true},
	"semester": {type: String, required: true},
	"startdate": {type: String, required: true},
	"enddate": {type: String, required: true},
	"starttime": {type: String, required: true},
	"endtime": {type: String, required: true},
	"monday": {type: String},
	"tuesday": {type: String},
	"wednesday": {type: String},
	"thursday": {type: String},
	"friday": {type: String},
	"saturday": {type: String},
	"campus": {type: String, required: true},
	"campuslat": {type: Number},
	"campuslng": {type: Number},
	"instructor": {type: String, required: true}
});




//a virtual for instructor's full name can be created in here

sectionsSchema.methods.serialize = function() {
	return {
		id: this._id,
		"subject": this.subject,
		"coursenumber": this.coursenumber,
		"title": this.title,
		"section": this.section,
		"credithours": this.credithours,
		"semester": this.semester,
		"startdate": this.startdate,
		"enddate": this.enddate,
		"starttime": this.starttime,
		"endtime": this.endtime,
		"mon": this.monday,
		"tue": this.tuesday,
		"wed": this.wednesday,
		"thu": this.thursday,
		"fri": this.friday,
		"sat": this.saturday,
		"campus": this.campus,
		"campuslat": this.campuslat,
		"campuslng": this.campuslng,
		"instructor": this.instructor
	};
}


const Section = mongoose.model("Section", sectionsSchema);

//students model
//schema to represent sections
const studentsSchema = mongoose.Schema({
	"studentid": {type: String, required: true},
	"firstname": {type: String, required: true},
	"lastname": {type: String, required: true},
	"semester": {type: String, required: true},
	"subject": {type: String, required: true},
	"coursenumber":{type: String, required: true},
	"title": {type: String, required: true},
	"section": {type: String, required: true},
	"credithours": {type: Number, required: true},
	"grade": {type: String},
	"status": {type: String, required: true},
	"startdate": {type: String, required: true},
	"enddate": {type: String, required: true},
	"starttime": {type: String, required: true},
	"endtime": {type: String, required: true},
	"mon": {type: String},
	"tue": {type: String},
	"wed": {type: String},
	"thu": {type: String},
	"fri": {type: String},
	"sat": {type: String},
	"campus": {type: String, required: true},
	"campuslat": {type: Number},
	"campuslng": {type: Number},
	"instructor": {type: String}

});

studentsSchema.virtual('fullname').get(function() {
  return `${this.firstname} ${this.lastname}`.trim();});

studentsSchema.methods.serialize = function() {
	return {
		id: this._id,
		studentid: this.studentid,
		fullname: this.fullname,
		semester: this.semester,
		subject: this.subject,
		coursenumber: this.coursenumber,
		title: this.title,
		section: this.section,
		credithours: this.credithours,
		grade: this.grade,
		status: this.status,
		startdate: this.startdate,
		enddate: this.enddate,
		starttime: this.starttime,
		endtime: this.endtime,
		mon:this.mon,
		tue: this.tue,
		wed: this.wed,
		thu: this.thu,
		fri: this.fri,
		sat: this.sat,
		campus: this.campus,
		campuslat:this.campuslat,
		campuslng:this.campuslng,
		instructor:this.instructor
	};
}

const Student = mongoose.model("Student", studentsSchema);
const Cart = mongoose.model("Cart", studentsSchema);

//======================================
//export models
module.exports = {Section, Student, Cart};




