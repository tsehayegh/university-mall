'use strict';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL, PORT} = require('../config');


chai.use(chaiHttp);

describe('index page', function(){
	before(function(){
		return runServer(DATABASE_URL);
	});

	after(function(){
		return closeServer();
	});

	it('should check if rending sections work', function(){
		return chai.request(app)
			.get('/sections')
		 	.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
			});
	});
});

