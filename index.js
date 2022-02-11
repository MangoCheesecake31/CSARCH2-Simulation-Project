const express = require('express');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

//	Express App
const app = express();

// 	Routes & View Engine

// 	Resource directories
const routes = require('./routes/router');
app.use(routes);
app.set('view engine','ejs');
app.use(express.static('public'));

//	Listen
app.listen(port, hostname, ()=> {
	console.log(`Server is now running at http://localhost:${port}`);
});