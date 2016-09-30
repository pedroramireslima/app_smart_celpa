//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('alerta', function($ionicPopup){
    var _msg  =function (title,message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
    };
    return {
        msg :  _msg
    };
});