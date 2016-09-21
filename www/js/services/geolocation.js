angular.module('smartq').factory('BackgroundGeolocationService', ['$q', '$http','smartqService','localStorageService','$cordovaLocalNotification', function ($q, $http,smartqService,localStorageService,$cordovaLocalNotification) {
  console.log("Serviço de geolocalização iniciado no angular");
    var callbackFn = function(location) {
      console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
      console.log(localStorageService.get('user_id')+"<<<");
      if (localStorageService.get('user_id')!==null){
        smartqService.putLocation(location.latitude,location.longitude).then(function (json) {
          console.log("Enviado para o servidor"+json.data);
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
         console.log("Erro enviando para o servidor");
         backgroundGeoLocation.finish();

      });
    }
  },


  failureFn = function(error) {
      console.log('BackgroundGeoLocation error ' + JSON.stringify(error));
  },

    //Enable background geolocation
  start = function () {
        //save settings (background tracking is enabled) in local storage
        window.localStorage.setItem('bgGPS', 1);

        backgroundGeoLocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 100,
            stationaryRadius: 200,
            distanceFilter: 200,
            debug: false,
            stopOnTerminate: false,
            locationService: 'ANDROID_DISTANCE_FILTER',
            interval: 5000
        });


        backgroundGeoLocation.start();
        console.log("Iniciou a Geolocation");
  };

  return {
    start: start,

      // Initialize service and enable background geolocation by default
      init: function () {
          var bgGPS = window.localStorage.getItem('bgGPS');
          if (bgGPS == 1 || bgGPS === null) {
            start();
        }
    },

      // Stop data tracking
      stop: function () {
          window.localStorage.setItem('bgGPS', 0);
          backgroundGeoLocation.stop();
      }
  };

}]);