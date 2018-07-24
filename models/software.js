"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var revisionSchema = new mongoose.Schema({
    codigo: { type: String, unique: true, required: true, trim: true },
    nombre: { type: String, unique: false, required: true, trim: true },
    descripcion: { type: String, unique: false, required: true, trim: true },
    desarrollador: { type: String, unique: false, required: true, trim: true },
    estado:{ type: String, unique: false, required: true, trim: true },
    numDescargas: { type: String, unique: false, required: false, trim: true },
    categoria: { type: String, unique: false, required: false, trim: true },
    precio: { type: String, unique: false, required: false, trim: true },
    logo: { type: String, unique: false, required: false, trim: true },
    archivo: { type: String, unique: false, required: false, trim: true }
},{collection:'software'});

revisionSchema.statics.findAll = function(callback){
    Software.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

revisionSchema.statics.findOne= function(nombre,callback){
    Software.find({nombre:nombre},'nombre descripcion logo precio archivo',function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

// revisionSchema.statics.mostrarP= function(nombre,callback){
//     Software.findOne({nombre:nombre},'nombre',function(err,users) {
//         if(err)
//             return callback(err);
//         else if(!users)
//             return callback();
//         return callback(null,users);
//     })
// }

revisionSchema.statics.insert = function(codigo,nombre,descripcion,desarrollador,estado,callback){
    Software.findOne({codigo:codigo},'codigo',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                codigo:codigo,
                nombre:nombre,
                descripcion:descripcion,
                desarrollador:desarrollador,
                estado:estado};
            Software.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
revisionSchema.statics.insertApp = function(codigo,nombre,descripcion,dev,status,categoria,precio,numDescargas,logo,archivo,callback){
    Software.findOne({codigo:codigo},'codigo',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                codigo:codigo,
                nombre:nombre,
                descripcion:descripcion,
                desarrollador:dev,
                estado:status,
                numDescargas: numDescargas,
                categoria: categoria,
                precio: precio,
                logo: logo,
                archivo: archivo
            };
            Software.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
revisionSchema.statics.update = function(codigo,nombre,descripcion,desarrollador,estado,callback){
    Software.findOne({codigo:codigo},'codigo nombre descripcion desarrollador estado',function(err,user){
        if(err)
            return callback(err);
        else if(!user){
           
            console.log(user);
            return callback();
        }
        else{
                if(codigo)
                    user.codigo = codigo;
                if(nombre)
                    user.nombre=nombre;
                if(descripcion){
                    user.descripcion = descripcion;}               
                if(desarrollador)
                    user.desarrollador = desarrollador;
                if(estado)
                    user.estado = estado;
                user.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

revisionSchema.statics.delete = function(codigo,callback){
    Software.findOne({codigo:codigo},'codigo',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'codigo no existe');
        Software.deleteOne({codigo:codigo}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}


let Software = mongoose.model('Software',revisionSchema);


module.exports = Software;