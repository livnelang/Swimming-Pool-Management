// Load the module dependencies/*
var clients = require('../../server/controllers/clients.controller');

// Define users routes module
module.exports = function(app) {
    // C.R.U.D operations
    // app.get('/getUsers', users.getUsers);
    app.post('/api/addClient', clients.addClient);
    // app.post('/createUser', users.createUser);
    // app.post('/deleteUser', users.deleteUser);
};