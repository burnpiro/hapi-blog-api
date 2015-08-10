var Users = require('./components/users/user.model');
var db = require('./database');

var admin = {
    userName: 'admin@localhost',
    password: 'testtest',
    scope: 'admin'
};

var user = new Users(admin);
user.save(admin, function(error, user) {
    if(!error) {
        console.log('User created successfully, userId: '+user._id);
    } else {
        if (11000 === error.code || 11001 === error.code) {
            console.log("User with this email already exists");
        } else {
            console.log('Cannot create User');
        }
    }
});