myApp.directive('mainHeader', function() {
    return {
        restrict: 'E',
        templateUrl: './components/mainHeader/mainHeader.html',
        controller: function($scope, $localStorage, $state, $rootScope){

            $scope.logout = function() {
                delete $localStorage.token;
                delete $localStorage.userName;
                delete $rootScope.userName;
                $state.go('signin');
            };
        }
    };
});