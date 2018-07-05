"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, unique: false, required: true, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
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


let User = mongoose.model('User',userSchema);


module.exports = User;