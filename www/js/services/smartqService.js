//Service para aquisição de dados e envio de dados

angular.module("smartq").factory('smartqService', function($http){

    var _get = function (){
        return $http.get('');
    };



    return {
        get : _get


    };

})