myApp.controller('ordersController', ['$scope', 'apiService', 'ngDialog', '$state', '$filter', function ($scope, apiService, ngDialog, $state, $filter) {

    $scope.orders = [];
    $scope.clients = [];
    $scope.formObject = {};
    $scope.formObject.clientAccountNumber = {};
    // $scope.clients[0] = {firstName: "כל הלקוחות", accountNumber: 99999};
    $scope.months = [
        {name: 'מאי', date: setMonthTime(4)},
        {name: 'יוני', date: setMonthTime(5)},
        {name: 'יולי', date: setMonthTime(6)},
        {name: 'אוגוסט', date: setMonthTime(7)},
        {name: 'ספטמבר', date: setMonthTime(8)},
        {name: 'אוקטובר', date: setMonthTime(9)}
    ];
    $scope.formObject.date = $scope.months[0].date;

    apiService.getAllClients().then(
        function (response) {
            $scope.clients = response.data;
            $scope.clients.unshift({firstName: "כל הלקוחות", accountNumber: 99999});
            $scope.formObject.clientAccountNumber =$scope.clients[0].accountNumber;
        },
        function (error) {
            console.log(error);
        });


    function setMonthTime(month) {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setMonth(month, 1);
        return new Date(d);
    }


    $scope.showResults = function () {
        apiService.getOrders($scope.formObject).then(
            function (response) {
                $scope.orders = response.data;
            },
            function (error) {
                // console.log(error);
            });
    }
}]);



