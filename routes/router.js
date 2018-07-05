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
			res.redirect('/profile');  }
	});
});

router.get('/profile',function(req, res, next){
	if(!req.session.username){
		res.redirect('/');
	}
	user.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('users',{usuario:req.session.username, modelo:users});
	}); 
});

// Usuarios
//INSERTAR
router.post('/users/insertar', function(req, res, next){
	user.insert(req.body.email,req.body.username,req.body.password,req.body.tel,req.body.rango, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('username ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/profile');
	  });
});

//ACTUALIZAR
router.post('/users/actualizar', function(req, res, next){
    console.log(req.body.email+' aca estoy');
	user.update(req.body.email,req.body.username,req.body.password,req.body.tel,req.body.rango, function(error,msg){
		console.log(req.body.username);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);}
		res.redirect('/profile');
		
	  });
});

//ELIMINAR
router.post('/users/eliminar', function(req, res, next){
	user.delete(req.body.username, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('username no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/profile');}
	  });
});


// Revision
router.get('/software',function(req, res, next){
	if(!req.session.username){
		res.redirect('/');
	}
	software.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('revision',{usuario:req.session.username, modelo:users});
	}); 
});
//INSERTAR
router.post('/revision/insertar', function(req, res, next){
	software.insert(req.body.codigo,req.body.nombre,req.body.descripcion,req.body.desarrollador,req.body.estado, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('codigo ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/software');
	  });
});

//ACTUALIZAR
router.post('/revision/actualizar', function(req, res, next){
    console.log(req.body.codigo+' aca estoy');
	software.update(req.body.codigo,req.body.nombre,req.body.descripcion,req.body.desarrollador,req.body.estado, function(error,msg){
		console.log(req.body.codigo);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Codigo no existe');
			err.status = 401;
			next (err);}
		res.redirect('/software');
		
	  });
});

//ELIMINAR
router.post('/revision/eliminar', function(req, res, next){
	spftware.delete(req.body.codigo, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('codigo no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/software');}
	  });
});



// Todos los 404
router.get('*', function(req, res){
	res.status(404).render('error404');
});
module.exports = router;