var mongoose   = require('mongoose');
var config     = require('../../config');
var bcrypt     = require('bcrypt');
var moment     = require('moment');
var _          = require('lodash');
var Schema     = mongoose.Schema;
var softDelete = require('mongoose-softdelete');

var userSchema = new Schema({
    userName      : { type: String, unique: true, required: true, trim: true },
    password      : { type: String, required: true, trim: true },
    scope         : { type: String, enum: config.scopes},
    createdAt     : { type: Date, default: Date.now }
});

userSchema.plugin(softDelete);

userSchema.statics.findUser = function(userName, callback) {
    this.findOne({userName: userName}, callback);
};

userSchema.statics.findByIdAndUserName = function(id, userName, callback) {
    this.findOne({_id: id, userName: userName}, callback);
};

userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(config.security.workFactor, function(error, salt) {
        if(error) {
            next(error);
        }

        bcrypt.hash(user.password, salt, function(error, hash) {
            if(error) {
                next(error);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePasswords = function(candidate, password, callback) {
    bcrypt.compare(candidate, password, function(error, isMatch) {
        if(error) {
            callback(error);
        }
        callback(null, isMatch);
    })
};


var user = mongoose.model('User', userSchema);

module.exports = exports = user;
