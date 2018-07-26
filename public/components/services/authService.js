myApp
    .service("authService", ["$http", "$q", function ($http, $q) {

        return {
            signin: function (formData) {
                return $http({
                    method: "POST",
                    url: "/api/authenticate",
                    data: formData
                });
            }
        };

    }]);