myApp.controller('addOrderController', ['$scope', 'apiService', function ($scope, apiService) {

    $scope.products = ['קרטיב', 'בירה', 'קולה'];
    $scope.newOrder = {};

    $scope.addOrder = function () {

        $scope.isLoading = true;
        apiService.addOrder($scope.newOrder).then(
            function (response) {
                $scope.isLoading = false;
            },
            function (error) {
                $scope.isLoading = false;
                console.log(error);
            });
    };

    // Fetch data
    $scope.fetchUsers = function () {

        var searchText_len = $scope.searchText.trim().length;

        // Check search text length
        if (searchText_len > 0) {
            apiService.getClients($scope.searchText).then(
                function (response) {
                    $scope.searchResult = response.data;
                },
                function (error) {
                    console.log(error);
                });

        } else {
            $scope.searchResult = {};
        }
    };

    // Set value to search box
    $scope.setValue = function (index, $event) {
        $scope.searchText = $scope.searchResult[index].name;
        $scope.searchResult = {};
        $event.stopPropagation();
    };

    $scope.searchBoxClicked = function ($event) {
        $event.stopPropagation();
    };

}]);