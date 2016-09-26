angular.module('smartq').factory('internet', ['$cordovaNetwork', function( $cordovaNetwork){
/*
 var _isOnline = $cordovaNetwork.isOnline();

    return {
        isOnline: _isOnline
    };
*/

 var _isOnline = true;
return {
        isOnline: _isOnline
    };


}])