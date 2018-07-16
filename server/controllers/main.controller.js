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
exports.addClient = function (req,res)  {
    res.set("Content-Type", "application/json");
    var newClient = new Clients(req.body.newClient);
    newClient.save(function(err, new_doc){
        if(!err) {
            res.json(new_doc);
        }
        else {
            if (err.code === 11000) {
                res.status(500).json({message: "מספר החשבון כבר קיים"});
            }
            else{
                res.status(500).json(err);
            }
        }
    });
};

exports.getClients = function (req,res)  {
    res.set("Content-Type", "application/json");
    var clientSearchText =req.body.clientSearchText;
        Clients.find({firstName: {$regex: clientSearchText}}, function(err, clients) {
        if(!err) {
            res.status(200).json(clients);
        }
        else {
            res.status(500).json(err);
        }
    });
};

exports.getAllClients = function (req,res)  {
    res.set("Content-Type", "application/json");
    Clients.find({}, function(err, clients) {
        if(!err) {
            res.status(200).json(clients);
        }
        else {
            res.status(500).json(err);
        }
    });
};

exports.addOrder = function (req,res)  {
    res.set("Content-Type", "application/json");
    var newOrder = new Orders(req.body.newOrder);
    newOrder.save(function(err, new_doc){
        if(!err) {
            res.json(new_doc);
        }
        else {
            console.log(err);
            res.status(500).json(err);
        }
    });
};

// exports.getOrders = function (req,res)  {
//     var orderFilter = req.body.formObject;
//     var startDate = new Date(orderFilter.date);
//
//     console.log(req.body.formObject);
//     res.set("Content-Type", "application/json");
//     Orders.find({
//         date: {
//             $gte: orderFilter.date,
//             $lt:  new Date(startDate.getFullYear(), startDate.getMonth()+1, 1)
//         },
//         accountNumber: orderFilter.clientAccountNumber
//
//     }, function(err, orders) {
//         if(!err) {
//             res.status(200).json(orders);
//         }
//         else {
//             res.status(500).json(err);
//         }
//     });
// };

exports.getOrders = function (req,res)  {
    var orderFilter = req.body.formObject;
    var startDate = new Date(orderFilter.date);

    console.log(req.body.formObject);
    res.set("Content-Type", "application/json");
    Orders.aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "accountNumber",
                    foreignField: "accountNumber",
                    as: "fromItems"
                }
            },
            { $match : { accountNumber : req.body.formObject.clientAccountNumber } },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
            },
            { $project: { fromItems: 0 } }
        ],
        function(err, result){
            console.log(result);
            console.log(err);
            res.status(200).json(result);
        })
};