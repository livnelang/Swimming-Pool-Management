moment = require("moment");

/*
 * Load Dependencies
 */
//Clients model
var Clients = require("mongoose").model("Client");

//Orders model
var Orders = require("mongoose").model("Order");

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

exports.sendClientOrdersByEmail = async function (req, res) {
  if (req.body.formObject.client.firstName === "כל הלקוחות") {
    return res.status(500).json({ message: "Cannot send mail with all customers" });
  }
  const results = await getClientMonthOrder(req.body.formObject);
  const { parse } = require("json2csv");

  // real data
  let data = results.map((order) => ({
    תאריך: moment(order.date).format("YYYY-MM-DD HH:mm"),
    מוצר: order.productName,
    מחיר: order.pricePerProduct,
    כמות: order.quantity,
    "סכום רכישה": order.pricePerProduct * order.quantity,
  }));

  const totalOrdersPrice = results.reduce(
    (acc, order) => acc + order.pricePerProduct * order.quantity,
    0
  );
  data.push({ "סכום רכישה כולל": totalOrdersPrice });

  //convert the data to CSV with the column names
  const csv = parse(data, [
    "תאריך",
    "מוצר",
    "מחיר",
    "כמות",
    "סכום רכישה",
    "סכום רכישה כולל",
  ]);

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

  if (mailsDetails.extraMail) {
    sendSmtpEmail.to.push({ email: mailsDetails.extraMail });
  }

  const base64CSV = Buffer.from(csv).toString("base64");
  sendSmtpEmail.attachment = [
    {
      name: "orders.csv",
      content: base64CSV,
    },
  ];

  sendSmtpEmail.templateId = 3;
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
