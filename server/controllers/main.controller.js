moment = require("moment");

/*
 * Load Dependencies
 */
//Clients model
var Clients = require("mongoose").model("Client");

//Orders model
var Orders = require("mongoose").model("Order");

//Products model
var Products = require("mongoose").model("Product");

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
    } else {
      if (err.code === 11000) {
        res.status(500).json({ message: "הלקוח כבר קיים" });
      } else {
        res.status(500).json(err);
      }
    }
  });
};

exports.getClients = function (req, res) {
  res.set("Content-Type", "application/json");
  var clientSearchText = req.body.clientSearchText;
  Clients.find(
    { firstName: { $regex: clientSearchText } },
    function (err, clients) {
      if (!err) {
        res.status(200).json(clients);
      } else {
        res.status(500).json(err);
      }
    }
  );
};

exports.getAllClients = function (req, res) {
  res.set("Content-Type", "application/json");
  Clients.find({}, function (err, clients) {
    if (!err) {
      res.status(200).json(clients);
    } else {
      res.status(500).json(err);
    }
  });
};

exports.getAllProducts = function (req, res) {
  res.set("Content-Type", "application/json");
  Products.find({}, function (err, products) {
    if (!err) {
      res.status(200).json(products);
    } else {
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
    } else {
      console.log(err);
      res.status(500).json(err);
    }
  });
};

 // NEW ORDER ENDPOINT
exports.addOrder2 = async function (req, res) {
  res.set("Content-Type", "application/json");

  const { productId, ...partialOrder } = req.body.newOrder;
  const product = await Products.findById(productId);

  const newOrder = new Orders({
    ...partialOrder,
    pricePerProduct: product.price,
    productName: product.name
  });

  newOrder.save(function (err, new_doc) {
    if (!err) {
      res.json(new_doc);
    } else {
      console.log(err);
      res.status(500).json(err);
    }
  });
};

exports.deleteOrder = function (req, res) {
  res.set("Content-Type", "application/json");
  Orders.remove({ _id: req.body.orderObjectId }, function (err) {
    if (!err) {
      res.status(200).json();
    } else {
      console.log(err);
      res.status(500).json(err);
    }
  });
};

exports.getOrders = async function (req, res) {
  var orderFilter = req.body.formObject;

  var startDate = new Date(orderFilter.date);
  var ordersQuery = {};
  res.set("Content-Type", "application/json");

  // if its all clients
  if (orderFilter.isAllClients) {
    Orders.aggregate(
      [
        {
          $match: {
            date: {
              $gte: new Date(orderFilter.date.startDate),
              $lt: new Date(orderFilter.date.endDate),
            },
          },
        },
        {
          $project: {
            firstName: 1,
            date: 1,
            lastName: 1,
            productName: 1,
            pricePerProduct: 1,
            quantity: 1,
            total: { $multiply: ["$pricePerProduct", "$quantity"] },
          },
        },
      ],
      function (err, results) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(results);
        }
      }
    );
  }
  // specific client
  else {
    const results = await getClientMonthOrder(orderFilter);
    res.status(200).json(results);
  }
};

exports.sendMonthlyOrdersByEmail = async function (req, res) {
  const results = await getAllClientsMonthlyTable(req.body.formObject);
  const { parse } = require("json2csv");

  // real data
  let data = results.map((row) => ({
    שם: row["_id"],
    "קולה/קרטיב": row["קולה/קרטיב"],
    בירה: row["בירה"],
    "סכום רכישה חודשי": row.totalSaleAmount,
    "": "",
    "קולה/קרטיב =4 ₪": "",
    "בירה =10 ₪": "",
  }));

  //convert the data to CSV with the column names
  const csv = parse(data, {withBOM: true});
  const base64CSV = Buffer.from(csv).toString("base64");

  const SibApiV3Sdk = require("sib-api-v3-sdk");
  let defaultClient = SibApiV3Sdk.ApiClient.instance;

  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SEND_IN_BLUE;

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = `${req.body.subjectPrefix} - הזמנות בריכה`;
  sendSmtpEmail.sender = {
    name: "Oz Noy",
    email: "15oznoy@gmail.com",
  };

  sendSmtpEmail.to = [];
  const mailsDetails = req.body.mailsDetails;

  if (mailsDetails.defaultMail) {
    sendSmtpEmail.to.push({
      email: process.env.DEFAULT_MAIL_ADDRESS,
      name: 'מש"א',
    });
  }

  if (mailsDetails.ownerMail) {
    sendSmtpEmail.to.push({
      email: process.env.OWNER_MAIL_ADDRESS,
      name: "עוז נוי",
    });
  }

  if (mailsDetails.accountantMail) {
    sendSmtpEmail.to.push({
      email: process.env.EXTRA_ACCOUNTANT_MAIL,
      name: 'מיכל הנה"ח',
    });
  }

  let attachmentName = `${mailsDetails.dateText} בריכה.csv`;
  attachmentName = attachmentName.replace(/ /g, '_');

  sendSmtpEmail.attachment = [
    {
      name: attachmentName,
      content: base64CSV,
    },
  ];

  sendSmtpEmail.templateId = 3;
  sendSmtpEmail.params = {
    dateText: mailsDetails.dateText,
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
      res.status(200).json();
    },
    function (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  );
  };

async function getClientMonthOrder(orderFilter) {
  return Orders.aggregate(
    [
      {
        $match: {
          firstName: orderFilter.client.firstName,
          lastName: orderFilter.client.lastName,
          date: {
            $gte: new Date(orderFilter.date.startDate),
            $lt: new Date(orderFilter.date.endDate),
          },
        },
      },
      {
        $project: {
          firstName: 1,
          date: 1,
          lastName: 1,
          productName: 1,
          pricePerProduct: 1,
          quantity: 1,
          total: { $multiply: ["$pricePerProduct", "$quantity"] },
        },
      },
    ],
    function (err, results) {
      if (err) {
        throw new Error({ message: "Failed to fetch client orders" });
      } else {
        return results;
      }
    }
  );
}

async function getAllClientsMonthlyTable(orderFilter) {
  return Orders.aggregate(
    [
      {
        $match: {
          date: {
            $gte: new Date(orderFilter.date.startDate),
            $lt: new Date(orderFilter.date.endDate),
          },
        },
      },
      {
        $group: {
          _id: { $concat: ["$firstName", " ", "$lastName"] },
          "קולה/קרטיב": {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$productName", "קרטיב"] },
                    { $eq: ["$productName", "קולה"] },
                  ],
                },
                "$quantity",
                0,
              ],
            },
          },
          בירה: {
            $sum: {
              $cond: [{ $eq: ["$productName", "בירה"] }, "$quantity", 0],
            },
          },
          totalSaleAmount: {
            $sum: { $multiply: ["$quantity", "$pricePerProduct"] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
    function (err, results) {
      if (err) {
        throw new Error({
          message: "Failed to fetch all clients monthly orders",
        });
      } else {
        return results;
      }
    }
  );
}
