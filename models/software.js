"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var revisionSchema = new mongoose.Schema({
    codigo: { type: String, unique: true, required: true, trim: true },
    nombre: { type: String, unique: false, required: true, trim: true },
    descripcion: { type: String, unique: false, required: true, trim: true },
    desarrollador: { type: String, unique: false, required: true, trim: true },
    estado:{ type: String, unique: false, required: true, trim: true },
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
    User.findOne({codigo:codigo},'codigo',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'codigo no existe');
        User.deleteOne({codigo:codigo}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}


let Software = mongoose.model('Software',revisionSchema);


module.exports = Software;