myApp.controller('ordersController', ['$scope', 'apiService', 'ngDialog', '$state', '$filter', function ($scope, apiService, ngDialog, $state, $filter) {

    $scope.orders = [];
    $scope.clients = [];
    $scope.formObject = {};
    $scope.formObject.clientAccountNumber = {};

    $scope.months = [
        {name: 'מאי', date: setMonthTime(4)},
        {name: 'יוני', date: setMonthTime(5)},
        {name: 'יולי', date: setMonthTime(6)},
        {name: 'אוגוסט', date: setMonthTime(7)},
        {name: 'ספטמבר', date: setMonthTime(8)},
        {name: 'אוקטובר', date: setMonthTime(9)}
    ];
    setCurrentMonth();


    apiService.getAllClients().then(
        function (response) {
            $scope.clients = response.data;
            $scope.clients.unshift({firstName: "כל הלקוחות", accountNumber: "allClients"});
            $scope.formObject.client = $scope.clients[0];
        },
        function (error) {
            console.log(error);
        });


    function setMonthTime(month) {
        var dateObj = {};

        var st = new Date();
        st.setHours(0, 0, 0, 0);
        st.setMonth(month, 1);

        dateObj.startDate = new Date(st);
        dateObj.endDate = new Date(st.getFullYear(), st.getMonth() + 1, 1);

        return dateObj;
    }


    $scope.showResults = function () {
        if($scope.formObject.client.firstName === "כל הלקוחות") {
            $scope.formObject.isAllClients = true;
        }
        else {
            $scope.formObject.isAllClients = false;
        }

        apiService.getOrders($scope.formObject).then(
            function (response) {
                $scope.orders = response.data;
            },
            function (error) {
                // console.log(error);
            });
    };


    $scope.getTotal = function() {
        var total = 0;
        for(var i = 0; i < $scope.orders.length; i++){
            total +=  $scope.orders[i].total;
        }
        return total;
    };

    function setCurrentMonth() {
        var currentDate = new Date();
        for(var i = 0; i<$scope.months.length;i++) {
            if(currentDate.getMonth() === $scope.months[i].date.startDate.getMonth()) {
                $scope.formObject.date = $scope.months[i].date;
                return;
            }
        }
    }

}]);



