myApp.controller('ordersController', ['$scope', 'apiService','ngDialog','$state', '$filter', function ($scope, apiService, ngDialog, $state, $filter) {

    $scope.months = {
        0: {name: 'מאי', date: setMonthTime(4)},
        1: {name: 'יוני', date: setMonthTime(5)},
        2: {name: 'יולי', date: setMonthTime(6)},
        3: {name: 'אוגוסט', date: setMonthTime(7)},
        4: {name: 'ספטמבר', date: setMonthTime(8)},
        5: {name: 'אוקטובר', date: setMonthTime(9)}
    };


    function setMonthTime(month) {
        var d = new Date();
        d.setHours(0,0,0,0);
        d.setMonth(month, 1);

        return new Date(d);
    }
}]);



