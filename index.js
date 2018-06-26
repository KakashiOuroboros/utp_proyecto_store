var express = require('express');
var app = express();
const path = require('path');

// Setting View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', function(req, res){
	res.render('index');
});
app.get('/login', function(req, res){
	res.render('login');
});
app.get('*', function(req, res){
	res.status(404).render('error404');
});


// Open listening port
// Set PORT:
// Mac / Linux: export NODE_JS_PORT=3000
const port = process.env.NODE_JS_PORT || 3000;
app.listen(port, function(){ console.log(`Escuchando en el puerto ${port}...`) });