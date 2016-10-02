/**
 * @ngdoc service
 * @name smartq.service: internet
 * @description Service responsável por verificar conexão com a internet.
 */
angular.module('smartq').factory('internet', function( $cordovaNetwork){

     var _isOnline = $cordovaNetwork.isOnline();
    return {
        isOnline: _isOnline
    };

})