'use strict';

const mongoose = require('mongoose');

//schema to represent sections
const sectionsSchema = mongoose.Schema({
	"coursename": {type: String, required: true},
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
	"instructor": {type: String, required: true}
});

sectionsSchema.virtual('course').get(function(){
	return `${this["course-name"]}: ${this.title}`;
});


//a virtual for instructor's full name can be created in here

sectionsSchema.methods.serialize = function() {
	return {
		id: this._id,
		"coursename": this.coursename,
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
		"instructor": this.instructor
	};
}


const Section = mongoose.model("Section", sectionsSchema);

module.exports = {Section};




