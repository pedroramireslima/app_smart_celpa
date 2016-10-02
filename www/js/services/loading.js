/**
 * @ngdoc service
 * @name smartq.service: loading
 * @description Service responsável por exibir o loading.
 */
angular.module('smartq').factory('loading', [
    '$ionicLoading',
    '$timeout',
    function($ionicLoading, $timeout) {
        return {
            /**
            * @ngdoc method
            * @name  show
            * @methodOf smartq.service: loading
            * @description Método que exibe a tela de loading.
            */
            show: function() {
                $ionicLoading.show({templateUrl: 'templates/loading.html'});
            },
            /**
            * @ngdoc method
            * @name  hide
            * @methodOf smartq.service: loading
            * @description Método que esconde tela de loading.
            */
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
