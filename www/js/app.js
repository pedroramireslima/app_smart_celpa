// SQapp Starter

angular.module('smartq', ['ionic','angular-carousel-3d','chart.js','ngCordova','LocalStorageModule'])

.run(function($ionicPlatform,BackgroundGeolocationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
//NOTE: Modifiquei aqui para teste
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
        controller  : 'circuitosController'
      }
    }
  });

   $stateProvider.state('app.controle', {
    url   : '/controle',
    views : {
      'menuContent': {
        templateUrl : 'templates/controle.html',
        controller  : 'controleController'
      }
    }
  });

   $stateProvider.state('app.agendamento', {
    url   : '/agendamento',
    views : {
      'menuContent': {
        templateUrl : 'templates/agendamento.html',
        controller  : 'agendamentoController'//controller: 'controleAgendamento'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
