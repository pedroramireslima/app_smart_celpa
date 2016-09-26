angular.module('smartq').factory('loading', [
    '$ionicLoading',
    '$timeout',
    function($ionicLoading, $timeout) {
        return {
            show: function() {
                $ionicLoading.show({templateUrl: 'templates/loading.html'});
            },
            hide: function() {
                if (!ionic.Platform.isWebView()) {
                    $timeout($ionicLoading.hide, 500);
                } else {
                    $ionicLoading.hide();
                }
            }
        };
    }
]);
