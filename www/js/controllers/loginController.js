/**
*  Controller da tela de login
*/
angular.module('smartq').controller('loginController', function($scope,$http,smartqService,loading,$location,config,$cordovaInAppBrowser,$rootScope,alertas){

var _quadroAtual = 0;

///////////////////////////////////////////////////////////////////////////////

$scope.doLogin = function () {

  var options = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no'
  };

  $cordovaInAppBrowser.open(config.SERVER.url+':'+config.SERVER.port+'/oauth/new?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&redirect_uri=http://localhost/callback', '_blank', options)
  .then(function(event) {
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
      if((event.url).startsWith("http://localhost/callback")) {
        //TODO: Separar código na string
        var code = event.url;
        console.log(code);
        code = code.replace("http://localhost/callback?code=","");
        code = code.replace("&response_type=code","");

        //TODO: fecho a tela da web


        //TODO: Colocar a tela de carregando
        //loading.show();

        //TODO: Pegar tokens a parti do código
        console.log(config.SERVER.url+':'+config.SERVER.port+'/oauth/token.json?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&code='+code);

         $http.post(config.SERVER.url+':'+config.SERVER.port+'/oauth/token.json?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&code='+code,{})
        .then(function (json) {
          alertas.mensagem_alerta('',json);

        },function (argument) {
          console.log("erro");
        });


        //TODO: Salvar dados localmente
        //TODO: Substituir nas urls os valores pelos dados locais
        //TODO: Modificar tela de loginpor uma de logar com mimnha conta smartq
        //TODO: Gerar APK
        //TODO: COlocar na google play

        $cordovaInAppBrowser.close();


      }
    });
  },function(event){
    console.log("Erro pegando oauth");
    $cordovaInAppBrowser.close();
  });




};




/*

$scope.doLogin = function () {
  getServeQuadros();
};
*/

function getServeQuadros() {

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
  loading.show();
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
       // console.log(json.data);

       smartqService.setQuadroAtual(json.data);
       $location.path( "app/principal");
     },function (json) {
           console.log("problema pegando quadros");
           getServeQuadroDetails(id);
         });



}



///////////////////////////////////////////////////////////////////////////////




});