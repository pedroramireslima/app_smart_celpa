//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('alerta', function($ionicPopup){

//variáveis
var _msg  =function (title,message) {
  var alertPopup = $ionicPopup.alert({
    title: title,
    template: message
  });
};



//retorno do service
return {
  msg :  _msg,

};


});