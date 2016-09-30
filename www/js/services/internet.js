angular.module('smartq').factory('internet', function( $cordovaNetwork){

     var _isOnline = $cordovaNetwork.isOnline();
    return {
        isOnline: _isOnline
    };

})