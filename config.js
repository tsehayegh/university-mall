'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/university-mall';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-university-mall';
exports.PORT = process.env.PORT || 8080;
