// SQapp Starter

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

////////////////////////////////////////////
/*
  $stateProvider.state('app', {
    url         : '/app',
    abstract    : true,
    templateUrl : 'templates/menu.html',
    controller  : 'principalController'
  });

  $stateProvider.state('app.principal', {
    url   : '/principal',
    views : {
      'menuContent': {
        templateUrl : 'templates/principal.html',
        controller  : 'principalController'
      }
    }
  });

  $stateProvider.state('app.circuitos', {
    url   : '/circuitos',
    views : {
      'menuContent': {
        templateUrl : 'templates/circuitos.html',
        controller  : 'principalController'
      }
    }
  });

   $stateProvider.state('app.controle', {
    url   : '/controle',
    views : {
      'menuContent': {
        templateUrl : 'templates/controle.html',
        controller  : 'principalController'
      }
    }
  });

   $stateProvider.state('app.agendamento', {
    url   : '/agendamento',
    views : {
      'menuContent': {
        templateUrl : 'templates/agendamento.html',
        controller  : 'principalController'
      }
    }
  });
*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
