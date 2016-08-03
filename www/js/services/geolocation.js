angular.module('smartq').factory('BackgroundGeolocationService', ['$q', '$http', function ($q, $http) {
   console.log("Serviço de geolocalização iniciado no angular");
   var callbackFn = function(location) {
    console.log("Entrei no callback");
    console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
     // $http({
          //request options to send data to server
     // });
     backgroundGeoLocation.finish();
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
  };

  return {
    start: start,

      // Initialize service and enable background geolocation by default
      init: function () {
          var bgGPS = window.localStorage.getItem('bgGPS');
          if (bgGPS == 1 || bgGPS == null) {
            start();
        }
    },

      // Stop data tracking
      stop: function () {
          window.localStorage.setItem('bgGPS', 0);
          backgroundGeoLocation.stop();
      }
  }
}]);