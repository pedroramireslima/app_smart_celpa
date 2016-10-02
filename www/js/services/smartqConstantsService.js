/**
 * @ngdoc service
 * @name smartq.service: config
 * @description Service contendo dados do servidor e do protocolo de login. (url, porta, id da aplicação oauth).
 */
angular.module('smartq').constant('config',{

SERVER:{
     url:"http://dev.smartquadro.com.br",
     port:"80"

},

OAUTH80:{
     client_id: "43e53fc48d5712844783d052105bba69",
     client_secret: "985031169ee9c8b274a0dc3178aca7f3"
}


});