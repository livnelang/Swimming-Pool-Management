var myApp = angular.module("myApp", ['ui.router', 'ngDialog', 'ngStorage']);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise("/menu");

    $stateProvider
        .state('signin', {
            url: '/signin',
            templateUrl: 'components/signIn/signIn.html',
            controller: 'signInController',
            data: {
                requireLogin: false
            }
        })
        .state('menu', {
            url: '/menu',
            templateUrl: 'components/menu/menu.html',
            controller: 'menuController',
            data: {
                requireLogin: true
            }
        })
        .state('addClient', {
            url: '/addClient',
            templateUrl: 'components/addClient/addClient.html',
            controller: 'addClientController',
            data: {
                requireLogin: true
            }
        })
        .state('addOrder', {
            url: '/addOrder',
            templateUrl: 'components/addOrder/addOrder.html',
            controller: 'addOrderController',
            data: {
                requireLogin: true
            }
        })
        .state('orders', {
            url: '/orders',
            templateUrl: 'components/orders/orders.html',
            controller: 'ordersController',
            data: {
                requireLogin: true
            }
        });


    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers['x-access-token'] = $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);


});


myApp.run(["$rootScope", "$localStorage", "$state", "$transitions", function ($rootScope, $localStorage, $state, $transitions) {

    $transitions.onStart({}, function ($transitions) {
        var requireLogin = $transitions.$to().data.requireLogin;

        if (requireLogin && typeof $localStorage.token === 'undefined') {
            $transitions.abort();
            $state.go('signin');
        }
        else {
            $rootScope.userName = $localStorage.userName;
        }
    });

}]);