/**
*  Controller da tela de login
*/
angular.module('smartq').controller('loginController', function($scope,$http,smartqService,loading,$location,config,$cordovaInAppBrowser,$rootScope,alerta,msg,localStorageService){

var _quadroAtual = 0;


if (localStorageService.get('code')!==null) {
  //Se tem usuário logado entra
  loading.show();
  getServeQuadros();
}


$scope.doLogin = function () {
  if (localStorageService.get('code')===null) {
    //Se não tem usuário registrado, fazer login
    login();
  }else{
    //Se tem usuário registrado entra
    loading.show();
    getServeQuadros();
  }
};

function login() {

  var options = {
      location   : 'no',
      clearcache : 'no',
      toolbar    : 'no'
  };

console.log(config.SERVER.url+':'+config.SERVER.port+'/oauth/new?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&redirect_uri=http://localhost/callback');
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
         $http.post(config.SERVER.url+':'+config.SERVER.port+'/oauth/token.json?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&code='+code,{})
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

            },function (json) {
              loading.hide();
              alerta.msg('Erro',msg.ERROR.user);
            });
            getServeQuadros();
          }
        },function (argument) {
          loading.hide();
          alerta.msg('Erro', msg.ERROR.operacao );
        });




      }
    });
  },function(event){
    console.log("Erro pegando oauth");
    $cordovaInAppBrowser.close();
  });




}


function getServeQuadros() {
loading.show();
  smartqService.getServerQuadros()
  .then(function(json){
   smartqService.setQuadros(json.data);
          // console.log(json.data);

          _quadroAtual=json.data[0].id;

          getServerCircuitos(_quadroAtual);


        },function(json){
          loading.hide();
          console.log("problema");
          getServeQuadros();
        });

}


    /*FUNÇÃO QUE PEGA OS AGENDAMENTOS DO QUADRO*/
    function getServerAgendamentos(id) {
            smartqService.getServerAgendamentos(id).then(function (json) {
                smartqService.setAgendamentos(json.data);


                getServerControle(_quadroAtual);
            },function (json) {
                getServerAgendamentos(id);
                console.log("problema pegando agendamentos");
            });
    }




/*FUNÇÃO QUE PEGA CIRCUITO*/
function getServerCircuitos(id){
  smartqService.getServerCircuitos(id).then(function (json) {

        smartqService.setCircuitos(json.data);
        getServerAgendamentos(_quadroAtual);


 //getServeQuadroDetails(_quadroAtual);

  },function (json) {
    getServerCircuitos(id);
    console.log("problema pegando circuitos");
  });

}

/*FUNÇÃO QUE PEGA CONTROLE DOS CIRCUITOS*/
function getServerControle(id) {
  smartqService.getServeControle(id).then(function (json) {
    //console.log(json.data);
    smartqService.setControle(json.data);
    getServeQuadroDetails(_quadroAtual);
  },function (argument) {
    getServerControle(id);
  });
}

/*FUNÇÃO QUE PEGA DETALHES DO QUADRO ATUAL*/
function getServeQuadroDetails(id){
  smartqService.getServerQuadrosDetails(id).then(function (json) {
    smartqService.setQuadroAtual(json.data);
    $location.path( "app/principal");
  },function (json) {
    console.log("problema pegando quadros");
    getServeQuadroDetails(id);
  });
}

//TODO: tratamento dos erros (exibir mensagens para usuário)


});