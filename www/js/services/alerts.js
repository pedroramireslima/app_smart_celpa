//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('alertas', function($ionicPopup){

//variáveis
var _mensagem_alerta  =function (title,message) {
  var alertPopup = $ionicPopup.alert({
    title: title,
    template: message
  });
};



//retorno do service
return {
  mensagem_alerta :  _mensagem_alerta,

};


});