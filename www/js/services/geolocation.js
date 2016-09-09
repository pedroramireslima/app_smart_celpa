angular.module('smartq').factory('BackgroundGeolocationService', ['$q', '$http','smartqService','localStorageService','$cordovaLocalNotification', function ($q, $http,smartqService,localStorageService,$cordovaLocalNotification) {
  console.log("Serviço de geolocalização iniciado no angular");
  //var user_id = localStorageService.get('code');
    var callbackFn = function(location) {
    console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
    //TODO: Colocar para só enviar depois que já tiver os dados de usuário
    //if (user_id!==null && user_id !==undefined){
    smartqService.putLocation(location.latitude,location.longitude).then(function (json) {
       console.log("Enviado para o servidor"+json.data);
       backgroundGeoLocation.finish();

$cordovaLocalNotification.schedule({
        id: 1,
        title: 'Title here',
        text: 'Text here',
        icon: "ress://icon.png",
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });


    },function (json) {
       console.log("Erro enviando para o servidor");
       backgroundGeoLocation.finish();

    });
    //}


},


failureFn = function(error) {
    console.log('BackgroundGeoLocation error ' + JSON.stringify(error));
},

  //Enable background geolocation
start = function () {
      //save settings (background tracking is enabled) in local storage
      window.localStorage.setItem('bgGPS', 1);

      backgroundGeoLocation.configure(callbackFn, failureFn, {
          desiredAccuracy: 1,
          stationaryRadius: 5,
          distanceFilter: 1,
          debug: false,
          stopOnTerminate: false,
          locationService: 'ANDROID_DISTANCE_FILTER',
          interval: 15000
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