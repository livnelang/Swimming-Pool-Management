myApp
    .service("apiService", ["$http", "$q", function ($http, $q) {

        return {
            addClient:function(){
                return $http({
                    method: "POST",
                    url: "/api/domains/addClient",
                    data: {}

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