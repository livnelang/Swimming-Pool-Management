myApp.controller('addClientController',['$scope', 'apiService', 'ngDialog', '$state', function ($scope, apiService, ngDialog, $state) {

    $scope.newClient = {};

    $scope.addClient= function() {

        $scope.isLoading = true;
        apiService.addClient($scope.newClient).then(
            function (response) {
                $scope.isLoading = false;
                $scope.orderHeader = "יש לקוח חדש!";
                $scope.orderStatus = 200;

                openOrderDialog();
            },
            function (error) {
                $scope.isLoading = false;

                $scope.orderHeader = "ההוספה נכשלה";
                $scope.orderMessage = error.data.message;
                openOrderDialog();
            });
    };


    function openOrderDialog() {
        ngDialog.open({
            template: 'addClientTemplateId',
            scope: $scope,
            preCloseCallback:function(){
                $scope.newOrder = {};
                $scope.orderMessage = "";
                $scope.orderStatus = "";

                $state.go('menu');
            }

        });
    }
}]);