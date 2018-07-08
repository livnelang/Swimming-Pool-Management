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
            getClients:function(searchText){
                return $http({
                    method: "POST",
                    url: "/api/getClients",
                    data: {
                        clientSearchText: searchText
                    }
                });
            },
            remove:function (id) {

                return $http({
                    method: "POST",
                    url: "/p/domains/remove",
                    data: {id:id}

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