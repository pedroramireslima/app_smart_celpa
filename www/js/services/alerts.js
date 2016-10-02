/**
 * @ngdoc service
 * @name smartq.service: alerta
 * @description Service responsável por exibir mensagens ao usuário (pop-ups).
 */
angular.module('smartq').factory('alerta', function($ionicPopup){
    /**
    * @ngdoc method
    * @name  _msg
    * @methodOf smartq.service: alerta
    * @description Abre pop-up para exibir ao usuário
    * @param {String} title Título do pop-up
    * @param {String} message Mensagem a ser exibida no pop-up
    */
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