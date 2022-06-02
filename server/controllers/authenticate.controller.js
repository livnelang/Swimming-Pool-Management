// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

//Clients model
var AppUser = require('mongoose').model('AppUser');

exports.authenticate = function (req,res)  {

    // find the user
    AppUser.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.status(401).json({message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, req.app.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.status(200).json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    userName: user.name,
                    defaultMailAddress: process.env.DEFAULT_MAIL_ADDRESS,
                    ownerMailAddress: process.env.OWNER_MAIL_ADDRESS,
                    extraAccountantMail: process.env.EXTRA_ACCOUNTANT_MAIL
                });
            }

        }

    });
};