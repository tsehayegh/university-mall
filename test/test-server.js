'use strict';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();

const app = require('../server.js');

chai.use(chaiHttp);

describe('index page', function(){
	it('should check if page exists', function(){
		return chai.request(app)
			.get('/dashboard')
		 	.then(function(res){
				expect(res).to.have.status(200);
			});
	});

	it('should load the map', function(){
		return chai.request(app)
		.get('/dashboard')
		.then(function(res){
			res.should.have.status(200);
			res.body.should.be.a('object');
		});
	})
});

