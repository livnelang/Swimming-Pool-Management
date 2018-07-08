myApp.controller('addClientController',['$scope', 'apiService', function ($scope, apiService) {

    $scope.newClient = {};

    $scope.addClient= function() {

        $scope.isLoading = true;
        apiService.addClient($scope.newClient).then(
            function (response) {
                $scope.isLoading = false;
            },
            function (error) {
                $scope.isLoading = false;
                console.log(error);
            });
    }
}]);