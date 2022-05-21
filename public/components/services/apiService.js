myApp
    .service("apiService", ["$http", "$q", function ($http, $q) {

        return {
            addClient:function(newClient){
                return $http({
                    method: "POST",
                    url: "/api/addClient",
                    data: {
                        newClient: newClient
                    }
                });
            },
            addOrder:function(newOrder){
                return $http({
                    method: "POST",
                    url: "/api/addOrder",
                    data: {
                        newOrder: newOrder
                    }
                });
            },
            deleteOrder:function(orderObjectId){
                return $http({
                    method: "POST",
                    url: "/api/deleteOrder",
                    data: {
                        orderObjectId: orderObjectId
                    }
                });
            },
            getClients:function(searchText){
                return $http({
                    method: "POST",
                    url: "/api/getClients",
                    data: {
                        clientSearchText: searchText
                    }
                });
            },
            getAllClients:function(){
                return $http({
                    method: "POST",
                    url: "/api/getAllClients"
                });
            },
            getOrders:function(formObject){
                return $http({
                    method: "POST",
                    url: "/api/getOrders",
                    data: {
                        formObject: formObject
                    }
                });
            },
            sendOrdersByMail:function(formObject, mailsDetails, subjectPrefix){
                return $http({
                    method: "POST",
                    url: "/api/sendOrdersByEmail",
                    data: {
                        formObject: formObject,
                        mailsDetails: mailsDetails,
                        subjectPrefix: subjectPrefix
                    }
                });
            },
            upsert:function (item) {

                return $http({
                    method: "POST",
                    url: "/p/domains/upsert",
                    data: item

                });
            }
        };

    }]);