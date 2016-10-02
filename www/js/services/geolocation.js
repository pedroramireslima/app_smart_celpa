/**
 * @ngdoc service
 * @name smartq.service: BackgroundGeolocationService
 * @description Service responsável pelo serviço em background de localização do usuário.
 */
angular.module('smartq').factory('BackgroundGeolocationService', ['$q', '$http','smartqService','localStorageService','$cordovaLocalNotification', function ($q, $http,smartqService,localStorageService,$cordovaLocalNotification) {

    /**
    * @ngdoc method
    * @name  doLogin
    * @methodOf smartq.service: BackgroundGeolocationService
    * @description Função de callback executada quando uma nova coordenada gps é adquirida, envia dados de posição para o servidor e pega notificações.
    * @param {Object} location Objeto contendo informações de geolocalização
    */
    var callbackFn = function(location) {
      console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
      if (localStorageService.get('user_id')!==null){
        smartqService.putLocation(location.latitude,location.longitude).then(function (json) {
        backgroundGeoLocation.finish();
        smartqService.getServerNotifications().then(function (json) {
          if (json.data.length!==0) {
            $cordovaLocalNotification.schedule({
              id: 1,
              title: 'Notificação Smartq',
              text: 'Você possui '+json.data.length +' notificações não lidas',
              icon: "ress://icon.png"
            }).then(function (result) {
              // ...
            });
          }
        });
      },function (json) {
         backgroundGeoLocation.finish();
      });
    }
  },

    /**
    * @ngdoc method
    * @name  failureFn
    * @methodOf smartq.service: BackgroundGeolocationService
    * @description Método executado ao ocorrer erro pegando coordenadas
    * @param {Object} error Objeto contendo informações de erro
    */
  failureFn = function(error) {
      console.log('BackgroundGeoLocation error ' + JSON.stringify(error));
  },

    /**
    * @ngdoc method
    * @name  start
    * @methodOf smartq.service: BackgroundGeolocationService
    * @description Método que inicia a geolocalização em background
    */
  start = function () {
    window.localStorage.setItem('bgGPS', 1);
    backgroundGeoLocation.configure(callbackFn, failureFn, {
        desiredAccuracy: 100,
        stationaryRadius: 200,
        distanceFilter: 200,
        debug: false,
        stopOnTerminate: false,
        locationService: 'ANDROID_DISTANCE_FILTER',
        interval: 60000
    });
    backgroundGeoLocation.start();
    console.log("Iniciou a Geolocation");
  };

  return {
    start: start,
    init: function () {
        var bgGPS = window.localStorage.getItem('bgGPS');
        if (bgGPS == 1 || bgGPS === null) {
        start();
      }
    },

    /**
    * @ngdoc method
    * @name  stop
    * @methodOf smartq.service: BackgroundGeolocationService
    * @description Método que para a geolocalização.
    */
    stop: function () {
      window.localStorage.setItem('bgGPS', 0);
      backgroundGeoLocation.stop();
    }
  };

}]);