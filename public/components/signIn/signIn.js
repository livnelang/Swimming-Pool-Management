'use strict';

/* Controllers */

myApp
    .controller('signInController', ['$rootScope', '$scope', '$localStorage', 'authService', '$state', 'SweetAlert',
        function ($rootScope, $scope, $localStorage, authService, $state, SweetAlert) {
            const loginErrorMessage = {
                title: "שגיאה",
                message: "פרטי התחברות אינם נכונים"
            };  

            $scope.signIn = function () {
                var formData = {
                    email: $scope.email,
                    password: $scope.password
                };

                authService.signin(formData).then(
                    function (response) {
                        const {loggedUser, mails} = response.data;
                        $localStorage.token = loggedUser.token;
                        $localStorage.userName = loggedUser.userName;
                        $localStorage.defaultMailAddress = mails.defaultMailAddress;
                        $localStorage.ownerMailAddress = mails.ownerMailAddress;
                        $localStorage.extraAccountantMail = mails.extraAccountantMail;

                        $rootScope.defaultMailAddress = mails.defaultMailAddress;
                        $rootScope.ownerMailAddress = mails.ownerMailAddress;
                        $rootScope.extraAccountantMail = mails.extraAccountantMail;
                        $state.go('menu');

                    }, function (error) {
                        $rootScope.error = 'Failed to signin';
                        SweetAlert.swal(loginErrorMessage.title, loginErrorMessage.message, "error");
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
        }]);