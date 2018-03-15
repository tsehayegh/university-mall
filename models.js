'use strict';

const mongoose = require('mongoose');

//schema to represent sections
const sectionsSchema = mongoose.Schema({
	"course-name": {type: String, required: true},
	"title": {type: String, required: true},
	"section": {type: String, required: true},
	"credit-hours": {type: Number, required: true},
	"semester": {type: String, required: true},
	"start-date": {type: Date, required: true},
	"end-date": {type: Date, required: true},
	"start-time": {type: String, required: true},
	"end-time": {type: String, required: true},
	"monday": {type: String},
	"tuesday": {type: String},
	"wednesday": {type: String},
	"thursday": {type: String},
	"friday": {type: String},
	"saturday": {type: String},
	"campus": {type: String, required: true},
	"instructor": {type: String}
});

sectionsSchema.virtual('course').get(function(){
	return `${this["course-name"]}: ${this.title}`;
});

//a virtual for instructor's full name can be created in here

sectionsSchema.methods.serialize = function() {
	return {
		id: this._id,
		course: this.course,
		"section": this.section,
		"credit-hours": this["credit-hours"],
		"semester": this.semester,
		"start-date": this["start-date"],
		"end-date": this["end-date"],
		"start-time": this["start-time"],
		"end-time": this["end-time"],
		"monday": this.monday,
		"tuesday": this.tuesday,
		"wednesday": this.wednesday,
		"thursday": this.thursday,
		"friday": this.friday,
		"saturday": this.saturday,
		"campus": this.campus,
		"instructor": this.instructor
	};
}


const Section = mongoose.model("Section", sectionsSchema);

module.exports = {Section};




