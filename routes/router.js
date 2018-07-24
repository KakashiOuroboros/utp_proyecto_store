"use strict";
let express = require('express');
let router = express.Router();
let user = require('../models/user');
let software = require('../models/software');
var multer = require('multer');

// Multer
var uploading = multer({
	dest: './public/dev/app/',
});

// Routes
router.get('/', function(req, res){
	res.render('index',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/login', function(req, res){
	res.render('login');
});
router.get('/productos', function(req, res){
	res.render('productos',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/educa', function(req, res){
	res.render('educa',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/empre', function(req, res){
	res.render('empre',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/juegos', function(req, res){
	res.render('juegos',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/servicio', function(req, res){
	res.render('servicio',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/editor', function(req, res){
	if(!req.session.username){
		res.redirect('/');
	}
	software.findOneSoftware(req.session.username,function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('editor',{usuario:req.session.username, modelo:users,rango:req.session.rango});
	});
});
router.get('/developers', function(req, res){
	res.render('developers',{usuario:req.session.username,rango:req.session.rango});
});
router.get('/admin', function(req, res){
	if (req.session.rango == 0){
		console.log("ENTRÓ UN ADMINISTRADOR");
		res.render('admin',{usuario:req.session.username}); 
	}
	else{
		console.log('rango: '+user.rango);
		console.log('logeado como: '+user.username);
		res.redirect('/');  
	}
});
router.get('/users', function(req, res){
	if (req.session.rango == 0){
		console.log("ENTRÓ UN ADMINISTRADOR");
		res.render('users');
	}
	else{
		console.log('rango: '+user.rango);
		console.log('logeado como: '+user.username);
		res.redirect('/');  
	}
});
router.get('/revision', function(req, res){
	if (req.session.rango == 0){
		console.log("ENTRÓ UN ADMINISTRADOR");
		res.render('revision');
	}
	else{
		console.log('rango: '+user.rango);
		console.log('logeado como: '+user.username);
		res.redirect('/');  
	}
});

//Login
router.post('/login', function(req, res, next){
	user.authenticate(req.body.email, req.body.password, function(error,user){
		if(error)
			next(error);
		else if(!user) {
			var err = new Error('Usuario o contraseña incorrecta');
            err.status = 401;
			next(err); 
			res.render('login', {mensaje2:'Usuario o contraseña incorrecta'})
			}
		else{
			req.session.username = user.username;
			req.session.rango = user.rango;
			if (req.session.rango == 0){
				console.log("ENTRÓ UN ADMINISTRADOR");
				res.redirect('/profile');  
			}
			else{
				console.log('rango: '+user.rango);
				console.log('logeado como: '+user.username);
				res.render('index',{usuario:req.session.username,rango:req.session.rango});  
			}
		}
	});
});

// Logout
router.get("/logout", function (req, res, next) {
	if(req.session){
		 req.session.destroy();
		 console.log("Adiós...");
	}
	res.redirect('/');
 });

 // Carga de usuarios
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

router.get('/account', function(req, res, next){
	if(!req.session.username){
		res.redirect('/');
	}
	user.findOneUser(req.session.username,function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('account',{usuario:req.session.username, modelo:users,rango:req.session.rango});
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

router.post('/users/registrar', function(req, res, next){
	var ran=2;
	if (req.body.rango==1){
		ran=1
	}
	user.insert(req.body.email,req.body.username,req.body.password,req.body.tel,ran, function(error,user){
		if(error){
			next(error);
			res.render('login',{mensaje:'El correo ya existe'});}
		else if(user){
			var err = new Error('username ya existente');
			err.status = 401;
			next(err);
			res.render('login',{mensaje:'El usuario ya existe'});}
		else
			res.render('login',{mensaje:'Cuenta registrada satisfactoriamente'});
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
router.post('/users/actualizarPerfil', function(req, res, next){
	user.updatePerfil(req.body.email,req.session.username,req.body.password,req.body.tel, function(error,msg){
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);}
			res.redirect('/account');
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

//Listar productos
router.post('/productos/mostrar', function(req, res, next){
	software.mostrarP(req.body.nombre,req.body.logo, function(error,msg){
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Producto no existe');
			err.status = 401;
			next (err);}
			res.redirect('/productos');
	  });
});

//EDITAR
router.get('/product',function(req, res, next){
	if(!req.session.username){
		res.redirect('/');
	}
	software.findAll(function(error,users){
		if(error)
			next(error);
		else if(!users)
			users = [];
		else
			res.render('editor',{usuario:req.session.username, modelo:users});
	}); 
});

//ACTUALIZAR EDITOR
router.post('/editor/actualizar', function(req, res, next){
	software.update(req.body.nombre,req.body.descripcion,req.body.categoria,req.body.precio,req.body.logo,req.body.archivo, function(error,msg){
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Codigo no existe');
			err.status = 401;
			next (err);}
		res.redirect('/product');
		
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

var cpUpload = uploading.fields([{ name: 'logo', maxCount: 1 }, { name: 'archivo', maxCount: 1 }])
router.post('/dev/upload',cpUpload, function(req, res, next){
	var d = new Date().getTime()
	var codigo= d;
	var dev = req.session.username;
	var status='Inactivo';
	var numDescargas=0;

	//Obtener logo
	var logo = req.files['logo'][0].path;

	//Obtener archivo
	var archivo = req.files['archivo'][0].path;
	console.log(archivo);

	software.insertApp(codigo,req.body.nombre,req.body.descripcion,dev,status,req.body.categoria,req.body.precio,numDescargas,logo,archivo, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('codigo ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/editor');
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
	software.delete(req.body.codigo, function(error,msg){
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