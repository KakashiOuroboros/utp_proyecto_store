"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, unique: false, required: true, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
    tel:{ type: String, unique: false, required: true, trim: true },
    rango:{ type: String, unique: false, required: true, trim: true }
},{collection:'users'});


userSchema.statics.authenticate = function(email,password,callback){
    User.findOne({email:email},'username password',function(err,user){
        if(err)
            return callback(err);
        else if(!user)
            return callback();
        var hash = user.password;
        if(bcrypt.compareSync(password, hash))
            return callback(null,user)
        else
            return callback();
    })
}

userSchema.statics.findAll = function(callback){
    User.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

userSchema.statics.insert = function(email,username,password,tel,rango,callback){
    User.findOne({username:username},'username',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                email:email,
                username:username,
                password:password,
                passConfirm:password,
                tel:tel,
                rango:rango};
            User.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
userSchema.statics.update = function(email,username,password,tel,rango,callback){
    User.findOne({username:username},'email username password passConfirm tel rango',function(err,user){
        if(err)
            return callback(err);
        else if(!user){
           
            console.log(user);
            return callback();
        }
        else{
                if(email)
                    user.email = email;
                if(username)
                    user.username=username;
                if(password){
                    user.password = password;
                    user.passConfirm = password;}               
                if(tel)
                    user.tel = tel;
                if(rango)
                    user.rango = rango;
                user.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

userSchema.statics.delete = function(username,callback){
    User.findOne({username:username},'username',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'username no existe');
        User.deleteOne({username:username}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}


let User = mongoose.model('User',userSchema);


module.exports = User;