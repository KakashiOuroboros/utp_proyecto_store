"use strict";
let express = require('express');
let router = express.Router();
let user = require('../models/user');
let software = require('../models/software')

//LOGIN
// Routes
router.get('/', function(req, res){
	res.render('index');
});
router.get('/login', function(req, res){
	res.render('login');
});
router.get('/productos', function(req, res){
	res.render('productos');
});
router.get('/admin', function(req, res){
	res.render('admin');
});
router.get('/users', function(req, res){
	res.render('users');
});
router.get('/revision', function(req, res){
	res.render('revision');
});
router.post('/login', function(req, res, next){
	user.authenticate(req.body.email, req.body.password, function(error,user){
		if(error)
			next(error);
		else if(!user) {
			var err = new Error('Usuario o contraseña incorrecta');
            err.status = 401;
			next(err); }
		else{
            req.session.username = user.username;
            console.log('logeado como: '+user.username);
			res.render('index');  }
	});
});




// Todos los 404
router.get('*', function(req, res){
	res.status(404).render('error404');
});
module.exports = router;