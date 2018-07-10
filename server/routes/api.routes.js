// Load the module dependencies/*
var clients = require('../../server/controllers/main.controller');

// Define users routes module
module.exports = function(app) {
    // C.R.U.D operations
    // app.get('/getUsers', users.getUsers);
    app.post('/api/addClient', clients.addClient);
    app.post('/api/addOrder', clients.addOrder);
    app.post('/api/getClients', clients.getClients);
    // app.post('/createUser', users.createUser);
    // app.post('/deleteUser', users.deleteUser);
};