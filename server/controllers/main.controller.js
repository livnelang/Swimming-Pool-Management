/*
 * Load Dependencies
 */
//Clients model
var Clients = require('mongoose').model('Client');

//Orders model
var Orders = require('mongoose').model('Order');

/**
 * getUsers
 * get all users from db
 * @param req
 * @param res
 */
// exports.getUsers = function (req,res)  {
//     res.set("Content-Type", "application/json");
//     Users.find({}).select({"_id": 0})
//         .exec(function(err, users){
//             if(err) {
//                 res.json(err);
//             }
//             else {
//                 res.json(users);
//             }
//         });
// };
//
// /**
//  * updateUser
//  * updates requested user
//  * @param req
//  * @param res
//  */
// exports.updateUser = function (req,res)  {
//     res.set("Content-Type", "application/json");
//
//     Users.findOne({id: req.body.user.id}, function(err, user) {
//         if(!err) {
//             user.name = req.body.user.name;
//             user.password = req.body.user.password;
//
//             user.save(function(save_err) {
//                 if(!save_err) {
//                     res.status(200).json(user);
//                 }
//                 else {
//                     res.status(500).json(save_err);
//                 }
//             });
//         }
//         else {
//             res.json(err);
//         }
//     });
// };

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
            console.log(err);
            res.status(500).json(err);
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

/**
 * deleteUser
 * deletes required user
 * @param req
 * @param res
 */
// exports.deleteUser = function (req,res)  {
//     res.set("Content-Type", "application/json");
//
//     Users.findOne({id: req.body.user_id}, function(err, user) {
//         if (!err) {
//             user.remove(function(err, doc){
//                 if(!err) {
//                     res.json(doc);
//                 }
//                 else {
//                     res.status(500).json(err);
//                 }
//             });
//         }
//         else {
//             res.status(500).json(err);
//         }
//     });
// };