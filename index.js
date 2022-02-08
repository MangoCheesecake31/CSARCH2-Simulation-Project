const express = require('express');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

//	Express App
const app = express();

// 	Routes & View Engine
const routes = require('./routes/router');
app.use(routes);
app.set('view engine','ejs');

//	Listen
app.listen(port, hostname, ()=> {
	console.log(`Server is now running at http://${hostname}:${port}`);
});