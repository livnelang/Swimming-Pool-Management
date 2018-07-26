var myApp = angular.module("myApp",['ui.router', 'ngDialog', 'ngStorage']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $rootScope) {

    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise("/menu");

    $stateProvider
        .state('signin', {
            url: '/signin',
            templateUrl: 'components/signIn/signIn.html',
            controller: 'signInController'
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


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $localStorage.token === 'undefined') {
            event.preventDefault();
            // get me a login modal!
        }
    });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers['x-access-token'] = $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);


});