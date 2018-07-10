myApp.controller('addOrderController', ['$scope', 'apiService','ngDialog', function ($scope, apiService, ngDialog) {

    $scope.products = ['קרטיב', 'בירה', 'קולה'];
    $scope.newOrder = {};

    $scope.addOrder = function () {

        $scope.isLoading = true;
        apiService.addOrder($scope.newOrder).then(
            function (response) {

                $scope.isLoading = false;
                $scope.orderStatus = 200;
                $scope.orderHeader = "ההזמנה נשמרה בהצלחה!";

                openOrderDialog();
            },
            function (error) {
                $scope.isLoading = false;
                $scope.orderHeader = "ההזמנה נכשלה";
                $scope.orderMessage = error.data.message;

                openOrderDialog();

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

        //first, set accountNumber field with searchText value
        $scope.newOrder.accountNumber = $scope.searchResult[index].accountNumber;

        $scope.searchText = $scope.searchResult[index].firstName + " " + $scope.searchResult[index].lastName;
        $scope.searchResult = {};
        $event.stopPropagation();
    };

    $scope.searchBoxClicked = function ($event) {
        $event.stopPropagation();
    };

    function openOrderDialog() {
        ngDialog.open({
            template: 'templateId',
            scope: $scope,
            preCloseCallback:function(){
                $scope.newOrder = {};
                $scope.orderMessage = "";
                $scope.orderStatus = "";
            }

        });
    }

}]);



