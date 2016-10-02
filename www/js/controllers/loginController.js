/**
 * @ngdoc controller
 * @name smartq.controller: loginController
 * @description Controller responsável pelo login da aplicação. Verifica se o usuário já está logado, faz requisições das informações ao servidor.
 */
angular.module('smartq').controller('loginController', function($scope,$http,smartqService,loading,$location,config,$cordovaInAppBrowser,$rootScope,alerta,msg,localStorageService,internet,$ionicPopup){

var _quadroAtual = 0;
smartqService.set_slide_position(_quadroAtual);


if (localStorageService.get('code')!==null) {
  if(internet.isOnline){
  loading.show();
  getServeQuadros();
  }else{
    alerta.msg(msg.ERROR.not_internet,'');
  }
}

/**
 * @ngdoc method
 * @name  doLogin
 * @methodOf smartq.controller: loginController
 * @description Verifica se o usuário já está logado, se sim redireciona para tela principal da aplicação, se não, redireciona para o login.
 */
$scope.doLogin = function () {
if(internet.isOnline){

  if (localStorageService.get('code')===null) {
    _quadroAtual = 0;
    //Se não tem usuário registrado, fazer login
    login();
  }else{
    //Se tem usuário registrado entra
    loading.show();
    getServeQuadros();
  }
}else{
  alerta.msg(msg.ERROR.not_internet,'');
}

};


/**
 * @ngdoc method
 * @name  login
 * @methodOf smartq.controller: loginController
 * @description Método utilizado para registrar usuário quando ainda não possui login ativo.
 */
function login() {

  var options = {
      location   : 'no',
      clearcache : 'yes',
      toolbar    : 'no',
      zoom:'no'
  };

  $cordovaInAppBrowser.open(config.SERVER.url+':'+config.SERVER.port+'/oauth/new?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&redirect_uri=http://localhost/callback', '_blank', options)
  .then(function(event) {
    var code          = '';
    var access_token  = '';
    var refresh_token = '';
    var expires_in    = '';



    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
      if((event.url).startsWith("http://localhost/callback")) {
        //Separar código na string
        code = event.url;
        code = code.replace("http://localhost/callback?code=","");
        code = code.replace("&response_type=code","");

        //fecha a tela da web
        $cordovaInAppBrowser.close();

        //Coloca a tela de carregando
        loading.show();

        //Pega tokens a parti do código
        $http.post(config.SERVER.url+':'+config.SERVER.port+'/oauth/token.json?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&code='+code,{},{timeout: 10000})
        .then(function (json) {
          access_token  = json.data.access_token;
          refresh_token = json.data.refresh_token;
          expires_in    = json.data.expires_in;

          if (access_token === undefined) {
            loading.hide();
            alerta.msg('Erro', msg.ERROR.operacao);
          }else{
            //Pega id e dados do user
            $http.get(config.SERVER.url+':'+config.SERVER.port+'/users/get/user.json?access_token='+access_token)
            .then(function (json) {
               var user_id    = json.data.user.id;
               var user_name  = json.data.user.name;
               var user_mail  = json.data.user.email;

              //Salva dados localmente
              localStorageService.set('code',code);
              localStorageService.set('access_token',access_token);
              localStorageService.set('refresh_token',refresh_token);
              localStorageService.set('expires_in',expires_in);
              localStorageService.set('user_id',user_id);
              localStorageService.set('user_name',user_name);
              localStorageService.set('user_mail',user_mail);
              getServeQuadros();

            },function (json) {
              loading.hide();
              alerta.msg('Erro',msg.ERROR.user);
            });

          }
        },function (argument) {
          loading.hide();
          alerta.msg('Erro', msg.ERROR.operacao );
        });




      }
    });
  },function(event){
    $cordovaInAppBrowser.close();
  });




}

/**
 * @ngdoc method
 * @name  getServerQuadros
 * @methodOf smartq.controller: loginController
 * @description Método que faz requisição ao servidor e salva os dados localmente dos quadros do usuário.
*/
function getServeQuadros() {
loading.show();
  smartqService.getServerQuadros()
  .then(function(json){
    smartqService.setQuadros(json.data);
    if (json.data.length===0) {
      loading.hide();
      $location.path( "nodata");
    } else {
      _quadroAtual=json.data[0].id;
      getServerCircuitos(_quadroAtual);
    }
  },function(json){
    loading.hide();
    alerta.msg(msg.ERROR.other_user,'');
    localStorageService.clearAll();
  });
}


/**
 * @ngdoc method
 * @name  getServerAgendamentos
 * @methodOf smartq.controller: loginController
 * @description Método que faz requisição ao servidor e salva os dados localmente dos agendamentos do usuário.
 * @param {Number} id Identificador do quadro
 */
function getServerAgendamentos(id) {
        smartqService.getServerAgendamentos(id).then(function (json) {
            smartqService.setAgendamentos(json.data);
            getServerControle(_quadroAtual);
        },function (json) {
            getServerAgendamentos(id);
            console.log("problema pegando agendamentos");
        });
}




/**
 * @ngdoc method
 * @name  getServerCircuitos
 * @methodOf smartq.controller: loginController
 * @description Método que faz requisição ao servidor e salva os dados localmente dos Circuitos do usuário.
 * @param {Number} id Identificador do quadro
 */
function getServerCircuitos(id){
  smartqService.getServerCircuitos(id).then(function (json) {
    smartqService.setCircuitos(json.data);
    getServerAgendamentos(_quadroAtual);
  },function (json) {
    getServerCircuitos(id);
    console.log("problema pegando circuitos");
  });
}


/**
 * @ngdoc method
 * @name  getServerControle
 * @methodOf smartq.controller: loginController
 * @description Método que faz requisição ao servidor e salva os dados localmente dos controles de demanda do usuário.
 * @param {Number} id Identificador do quadro
 */
function getServerControle(id) {
  smartqService.getServeControle(id).then(function (json) {
    smartqService.setControle(json.data);
    getServeQuadroDetails(_quadroAtual);
  },function (argument) {
    getServerControle(id);
  });
}

/**
 * @ngdoc method
 * @name  getServerQuadroDetails
 * @methodOf smartq.controller: loginController
 * @description Método que faz requisição ao servidor e salva os dados localmente das informações de um quadro específico do usuário.
 * @param {Number} id Identificador do quadro
 */
function getServeQuadroDetails(id){
  smartqService.getServerQuadrosDetails(id).then(function (json) {
    smartqService.setQuadroAtual(json.data);
    $location.path( "quadros");
  },function (json) {
    console.log("problema pegando quadros");
    getServeQuadroDetails(id);
  });
}



});