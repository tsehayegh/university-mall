'use strict';

const mongoose = require('mongoose');

//schema to represent sections
const sectionsSchema = mongoose.Schema({
	"course-name": {type: String, required: true},
	"title": {type: String, required: true},
	"section": {type: String, required: true},
	"credit-hours": {type: Number, required: true},
	"semester": {type: String, required: true},
	"start-date": {type: String, required: true},
	"end-date": {type: String, required: true},
	"start-time": {type: String, required: true},
	"end-time": {type: String, required: true},
	"monday": {type: String},
	"tuesday": {type: String},
	"wednesday": {type: String},
	"thursday": {type: String},
	"friday": {type: String},
	"saturday": {type: String},
	"campus": {type: String, required: true}
});

sectionsSchema.virtual('course').get(function(){
	return `${this["course-name"]}: ${this.title}`;
});


//a virtual for instructor's full name can be created in here

sectionsSchema.methods.serialize = function() {
	return {
		id: this._id,
		"course-name": this["course-name"],
		"title": this.title,
		"section": this.section,
		"credit-hours": this["credit-hours"],
		"semester": this.semester,
		"start-date": this["start-date"],
		"end-date": this["end-date"],
		"start-time": this["start-time"],
		"end-time": this["end-time"],
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




