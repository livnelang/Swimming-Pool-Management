var myApp = angular.module("myApp",['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise("/menu");

    $stateProvider
        .state('menu', {
            url: '/menu',
            templateUrl: 'components/menu/menu.html',
            controller: 'menuController'
        })
        .state('addClient', {
            url: '/addClient',
            templateUrl: 'components/addClient/addClient.html',
            controller: 'addClientController'
        })
        .state('addOrder', {
            url: '/addOrder',
            templateUrl: 'components/addOrder/addOrder.html',
            controller: 'addOrderController'
        })
});