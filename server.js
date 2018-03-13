'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/dashboard', (req, res) => {
	res.status(200).sendFile(__dirname+'/public/index.html');
});


if(require.main === module) {
	app.listen(process.env.PORT || 8080, function() {
		const port = process.env.PORT || 8080;
		console.log(`App is listening on ${port}`)
	});
}


module.exports = app;
