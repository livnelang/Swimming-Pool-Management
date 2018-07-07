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
        // .state('addClient', {
        //     url: '/addClient/',
        //     template: '<edit-user></edit-user>'
        // })
        // .state('addOrder', {
        //     url: '/addOrder/',
        //     template: '<edit-user></edit-user>'
        // })
});