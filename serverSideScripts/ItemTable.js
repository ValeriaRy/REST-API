"use strict";

var mysql = require('mysql');
var validation = require("./serverSideScripts/validation.js");
var userTable = require("./serverSideScripts/UserTable.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "valeriary",
  password: "",
  database: "node"
});

function authorizationAndValidationChecks(token, item) {
  var query = connection.query('SELECT * FROM User WHERE token= ?', token.Authorization, function(err, result) {
    if (result.length) {
      item.user_id = result[0].id;
      var validation = validation.validationItem(item);
      if (typeof(validation) === "object") {
        
        return(validation);
      } else {
        
        return item;
      }
    } else {
      
      return({});
    }
  });
}

function addTheHostOfItem(item) {
  var queryUser = connection.query('SELECT * FROM User WHERE id= ?', item.user_id, function(err, result) {  
    item.user = userTable.deletePrivateProperties(result[0]);
    /*There should be a function of the determination image link*/
    item.image = "http://example.com/images/**/*.jpg";
    
    return item;
  });
}

function createItem(token, item, answer) {
  var newItem = authorizationAndValidationChecks(token, item);
  if (newItem.user_id) {
    newItem.date = new Date().toLocaleTimeString();
    var queryCreateItem = connection.query('INSERT INTO Item SET ?', newItem, function(err, result) {
      answer(addTheHostOfItem(newItem));
    });
  } else {
    answer(newItem);
  }
}

function updateItem(token, item, answer) {
  var newItem = authorizationAndValidationChecks(token, item); 
  if (newItem.user_id) {
    var query = connection.query("UPDATE Item SET ? WHERE user_id='" + newItem.user_id + "'", newItem, function(err, result) {
      answer(addTheHostOfItem(newItem));
    });
  } else {
    answer(newItem);
  }
}

function deleteItem(token, answer) {
  var user; 
  var queryUser = connection.query('SELECT * FROM User WHERE token= ?', token.Authorization, function(err, result) {
    if (result.length) {
      user = result[0].id;
      var query = connection.query("DELETE FROM Item WHERE user_id=" + user, function(err, result) {
        answer(200);
      });
    } else {
      answer({});  
    }
  });
}

function getItemById(id, answer) {
  var query = connection.query('SELECT * FROM Item WHERE item_id = ?', id, function(err, result) {
    if (result.length) {
      answer(addTheHostOfItem(result[0]));
    } else {
      answer({});
    }
  });
}

function searchItems(parameters, answer) {
  if ((parameters.title) && (parameters.user_id)) {
    var queryStr = createQueryStringForSearch(parameters);
    if (queryStr) {
      var query = connection.query(queryStr, function(err, result) {
        answer(result);
      });
    } else {
      answer({});
    }
  } else {
      answer({});
  }   
}

function createQueryStringForSearch(parameters) {
  var queryStr = "SELECT * FROM Item";
  if (parameters.title) {
    queryStr = queryStr + "WHERE title='" + parameters.title + "'";
    if (parameters.user_id) {
      queryStr = queryStr + " AND user_id=" + parameters.user_id;
    }
  } else if (parameters.user_id) {
    queryStr = queryStr + "WHERE user_id=" + parameters.user_id;
  } else {
    
    return false;
  }
  if (parameters.order_by) {
    queryStr = queryStr + " ORDER BY " + parameters.order_by;
    if (parameters.order_type) {
      queryStr = queryStr + " " + parameters.order_type; 
    }
  }
  
  return queryStr;
}

exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = updateItem;
exports.getItemById = getItemById;
exports.searchItems = searchItems;