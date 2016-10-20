var express = require('express');
var app = express();
var workWithUserTable = require("./serverSideScripts/UserTable.js");
var workWithItemTable = require("./serverSideScripts/ItemTable.js");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart()); 

app.post('/api/login', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.loginUser(req.body, function(answer) {
        sendAnswerAboutUser(res, answer);    
    });
});

app.post('/api/register', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.registerUser(req.body, function(answer) {
        sendAnswerAboutUser(res, answer);    
    });
});

app.get('/api/me', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.searchUser(req.query, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (401, {});
        } else {
            res.send(200, answer);
        }
    });
});

app.put('/api/me', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.updateUser(req.query, req.body, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (401, {});
        } else if (answer.field){
            res.send (422, answer);
        } else {
            res.send(200, answer);
        }
    });
});

app.get('/api/user/:id', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.searchUser(req.query, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (401, {});
        } else {
            res.send(200, answer);
        }
    });
});

app.get('/api/user', function(req, res) {
    removeTheServerLimit(req, res);
    workWithUserTable.searchUsersForParametres(req.query, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (401, {});
        } else {
            res.send(200, answer);
        }    
    });
});

app.post('/api/item', function(req, res) {
    removeTheServerLimit(req, res);
    workWithItemTable.createItem(req.query, req.body, function(answer) {
        sendAnswerAbouItem(res, answer);     
    });
});

app.put('/api/item/:id', function(req, res) {
    removeTheServerLimit(req, res);
    workWithItemTable.updateItem(req.query, req.body, function(answer) {
        sendAnswerAbouItem(res, answer);
    });
});

app.delete('/api/item/:id', function(req, res) {
    removeTheServerLimit(req, res);
    workWithItemTable.deleteItem(req.query, function(answer) {
        sendAnswerAbouItem(res, answer);
    });
});

app.get('/api/item/:id', function(req, res) {
    removeTheServerLimit(req, res);
    workWithItemTable.getItemById(req.query.id, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (404, {});
        } else {
            res.send(200, answer);
        } 
    });
});

app.get('/api/item/', function(req, res) {
    removeTheServerLimit(req, res);
    workWithItemTable.searchItems(req.query, function(answer) {
        if (Object.keys(answer).length === 0) {
            res.send (404, {});
        } else {
            res.send(200, answer);
        } 
    });
});

function sendAnswerAboutUser(res, answer) {
    if (typeof(answer) === "object") {
        res.send (422, answer);
    } else {
        res.send(200, {"token": "3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8"});
    }    
}

function sendAnswerAbouItem(res, answer) {
    if (Object.keys(answer).length === 0) {
        res.send (401, {});    
    } else if (answer.field) {
        res.send(422, answer);
    } else {
        res.send(200, answer);
    }   
}

/*Remove the server limit. If they are*/
function removeTheServerLimit(req, res) {
  req.setMaxListeners(0);
  res.setHeader("Access-Control-Allow-Origin", "*");
}

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
});