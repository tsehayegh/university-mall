'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));


if(require.main === module) {
	app.listen(process.env.PORT || 8080, function() {
		const port = process.env.PORT || 8080;
		console.log(`App is listening on ${port}`)
	});
}


module.exports = app;
