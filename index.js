"use strict";
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session'); 
let path = require('path');
let MongoStore = require('connect-mongo')(session);

//Mongoose Connection 
let mongoose = require('mongoose');
mongoose.connect('mongodb://altkemist-dev:kirajega@localhost/indevpa?authDatabase=indevpa');
let db = mongoose.connection;
db.on('error',console.error.bind(console,'Error de Conexion: '));
db.once('open',() => {
	console.log('Connected to Mongo Database');
});

// Setting View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
  }));

// Routes
let routes = require('./routes/router');
app.use('/',routes);
app.use(function(req,res,next){
	let err = new Error('Archivo no encontrado');
	err.status=404;
	next(err);
});

// Open listening port
// Set PORT:
// Mac / Linux: export NODE_JS_PORT=3000
const port = process.env.NODE_JS_PORT || 3000;
app.listen(port, function(){ console.log(`Escuchando en el puerto ${port}...`) });