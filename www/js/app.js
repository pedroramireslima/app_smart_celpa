/**
 * @ngdoc  object
 * @name smartq
 * @description Módulo da aplicação, é aqui que são definidas as rotas que são utilizadas no aplicativo bem como as configurações.
 */
angular.module('smartq', ['ionic','angular-carousel-3d','chart.js','ngCordova','LocalStorageModule'])

.run(function($ionicPlatform,BackgroundGeolocationService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
     BackgroundGeolocationService.init();
  });
})


.config(function($stateProvider, $urlRouterProvider,$cordovaInAppBrowserProvider) {


$stateProvider.state('login',{
    url         : '/login',
    templateUrl : 'templates/login.html',
    controller  : 'loginController'

});

  $stateProvider.state('nodata',{
      url         : '/nodata',
      templateUrl : 'templates/nodata.html',
      controller  : 'nodataController'
  });

////////////////////////////////////////////
  $stateProvider.state('quadros', {
    url         : '/quadros',
    templateUrl : 'templates/quadros.html',
    controller  : 'principalController'
  });


// if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
