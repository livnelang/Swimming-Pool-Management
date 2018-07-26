// Load the module dependencies/*
var clients = require('../../server/controllers/main.controller');
var authenticate = require('../../server/controllers/authenticate.controller');
var jwt = require('jsonwebtoken');

// Define users routes module
module.exports = function(app) {
    // C.R.U.D operations
    // app.get('/getUsers', users.getUsers);

    // authentication routes
    app.post('/api/authenticate', authenticate.authenticate);

    // route middleware to verify a token
    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });



    app.post('/api/addClient', clients.addClient);
    app.post('/api/addOrder', clients.addOrder);
    app.post('/api/getClients', clients.getClients);
    app.post('/api/getAllClients', clients.getAllClients);
    app.post('/api/getOrders', clients.getOrders);


};