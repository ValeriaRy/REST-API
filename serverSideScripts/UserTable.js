"use strict";

var mysql = require('mysql');
var validation = require("./serverSideScripts/validation.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "valeriary",
  password: "",
  database: "c9"
});

function registerUser(user, answer) {
    Object.defineProperty(user, "__proto__", {enumerable: false});
    var validationСheckUser = validation.validationOfUser(user);
    if (typeof(validationСheckUser) === "object") {
        answer(validationСheckUser);        
    } else {
        /*There should be the function of the token generation*/
        user.token = "3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8";
        var query = connection.query("SELECT * FROM User WHERE email='" + user.email + "' OR name='" + user.name +"'",
        function(err, result) {
            if (result.length) {
                answer({"message":"This User already exists"});
            } else {
                var queryRegister = connection.query('INSERT INTO User SET ?', user, function(err, result) {
                    console.log(err);
                    answer(true);
                });
            }
        });
    }
}

function loginUser(user, answer) {
    Object.defineProperty(user, "__proto__", {enumerable: false});
    var validationСheckUser = validation.validationOfLogin(user);
    if (typeof(validationСheckUser) === "object") {
        answer(validationСheckUser);        
    } else {
        var query = connection.query('SELECT * FROM User WHERE email= ?', user.email, function(err, result) {
        answer(true);    
        });
    }
}

function updateUser(token, user, answer) {
    var query = connection.query('SELECT * FROM User WHERE token= ?', token.Authorization, function(err, result) {
        if (!result.length) {
            answer({});
        } else {
            var validationNewPassword = validation.validationOfNewPassword(user);
            if (typeof(validationNewPassword) === "object") {
                answer (validationNewPassword);
            } else {
                user.password = user.new_password;
                delete user.current_password;
                delete user.new_password;
                var queryUpdate = connection.query("UPDATE User SET ? WHERE token='" + token.Authorization + "'", user, function(err, result) {
                    answer(deletePrivateProperties(result[0]));
                });
            }
        }
    });
}

function searchUser(token, answer) {
    var query = connection.query('SELECT * FROM User WHERE token= ?', token.Authorization, function(err, result) {
        if (!result.length) {
            answer({});
        } else {
            answer(deletePrivateProperties(result[0]));
        }
    });
}

function searchUsersForParametres(parameters, answer) {
    if ((parameters.name) && (parameters.email)) {
        var query = connection.query("SELECT * FROM User WHERE name='" + parameters.name + "' AND email='" + parameters.email + "'", 
        function(err, result) {
            answer(deletePrivateProperties(result[0]));
        });
    } else if ((parameters.name) && (!parameters.email)) {
        var queryName = connection.query('SELECT * FROM User WHERE name=' + parameters.name, function(err, result) {
            answer(deletePrivateProperties(result[0]));
        });
    } else if ((!parameters.name) && (parameters.email)) {
        var queryEmail = connection.query('SELECT * FROM User WHERE email=' + parameters.email, function(err, result) {
            answer(deletePrivateProperties(result[0]));
        });
    } else {
        answer({});
    } 
}

function deletePrivateProperties(user) {
    delete user.token;
    delete user.password;
    return user;
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.searchUser = searchUser;
exports.updateUser = updateUser;
exports.searchUsersForParametres = searchUsersForParametres;
exports.deletePrivateProperties = deletePrivateProperties;