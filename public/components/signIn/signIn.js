'use strict';

/* Controllers */

myApp
    .controller('signInController', ['$rootScope', '$scope', '$location', '$localStorage', 'authService', function($rootScope, $scope, $location, $localStorage, authService) {

        $scope.signIn = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            authService.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    $localStorage.token = res.data.token;
                    window.location = "/";
                }
            }, function(error) {
                $rootScope.error = 'Failed to signin';
            })
        };

        // $scope.signup = function() {
        //     var formData = {
        //         email: $scope.email,
        //         password: $scope.password
        //     }
        //
        //     Main.save(formData, function(res) {
        //         if (res.type == false) {
        //             alert(res.data)
        //         } else {
        //             $localStorage.token = res.data.token;
        //             window.location = "/"
        //         }
        //     }, function() {
        //         $rootScope.error = 'Failed to signup';
        //     })
        // };

        // $scope.me = function() {
        //     Main.me(function(res) {
        //         $scope.myDetails = res;
        //     }, function() {
        //         $rootScope.error = 'Failed to fetch details';
        //     })
        // };

        // $scope.logout = function() {
        //     Main.logout(function() {
        //         window.location = "/"
        //     }, function() {
        //         alert("Failed to logout!");
        //     });
        // };
        // $scope.token = $localStorage.token;
    }]);