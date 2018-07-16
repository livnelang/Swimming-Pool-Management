// Load the module dependencies/*
var clients = require('../../server/controllers/main.controller');
var authenticate = require('../../server/controllers/authenticate.controller');

// Define users routes module
module.exports = function(app) {
    // C.R.U.D operations
    // app.get('/getUsers', users.getUsers);
    app.post('/api/addClient', clients.addClient);
    app.post('/api/addOrder', clients.addOrder);
    app.post('/api/getClients', clients.getClients);
    app.post('/api/getAllClients', clients.getAllClients);

    app.post('/api/getOrders', clients.getOrders);

    // authentication routes
    app.post('/api/authenticate', authenticate.authenticate);

    // app.post('/createUser', users.createUser);
    // app.post('/deleteUser', users.deleteUser);
};