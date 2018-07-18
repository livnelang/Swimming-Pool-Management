/*
 * Load Dependencies
 */
//Clients model
var Clients = require('mongoose').model('Client');

//Orders model
var Orders = require('mongoose').model('Order');

/**
 * addClient
 * creates new client
 * @param req
 * @param res
 */
exports.addClient = function (req, res) {
    res.set("Content-Type", "application/json");
    var newClient = new Clients(req.body.newClient);
    newClient.save(function (err, new_doc) {
        if (!err) {
            res.json(new_doc);
        }
        else {
            if (err.code === 11000) {
                res.status(500).json({message: "מספר החשבון כבר קיים"});
            }
            else {
                res.status(500).json(err);
            }
        }
    });
};

exports.getClients = function (req, res) {
    res.set("Content-Type", "application/json");
    var clientSearchText = req.body.clientSearchText;
    Clients.find({firstName: {$regex: clientSearchText}}, function (err, clients) {
        if (!err) {
            res.status(200).json(clients);
        }
        else {
            res.status(500).json(err);
        }
    });
};

exports.getAllClients = function (req, res) {
    res.set("Content-Type", "application/json");
    Clients.find({}, function (err, clients) {
        if (!err) {
            res.status(200).json(clients);
        }
        else {
            res.status(500).json(err);
        }
    });
};

exports.addOrder = function (req, res) {
    res.set("Content-Type", "application/json");
    var newOrder = new Orders(req.body.newOrder);
    newOrder.save(function (err, new_doc) {
        if (!err) {
            res.json(new_doc);
        }
        else {
            console.log(err);
            res.status(500).json(err);
        }
    });
};

exports.getOrders = function (req, res) {
    var orderFilter = req.body.formObject;
    var startDate = new Date(orderFilter.date);
    var ordersQuery = {};
    res.set("Content-Type", "application/json");

    // set the query date
    ordersQuery.date = {
        $gte: orderFilter.date,
        $lt: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)
    };

    // if its a client only
    if (!orderFilter.isAllClients) {
        ordersQuery.accountNumber =  orderFilter.clientAccountNumber;
    }

    Orders.find(ordersQuery, function (err, clients) {
        if (!err) {
            res.status(200).json(clients);
        }
        else {
            res.status(500).json(err);
        }
    });
};