/**
*  Controller da tela de login
*/
angular.module('smartq').controller('loginController', function($scope,$http,smartqService,loading,$location){


  var Oauth={};
  Oauth.url="http://52.20.21.167:3500/oauth/";
  Oauth.client_id= "5f7396418354799903da39cfbf7dbe11";
  Oauth.client_secret= "9a41e2c35f4a143f7aae1d96b8cb8e18";

  var _quadroAtual = 0;

///////////////////////////////////////////////////////////////////////////////
$scope.doLogin = function (argument) {
  getServeQuadros();
};


function getServeQuadros() {

  smartqService.getServerQuadros()
  .then(function(json){
   smartqService.setQuadros(json.data);
          // console.log(json.data);

          _quadroAtual=json.data[0].id;

          getServerCircuitos(_quadroAtual);


        },function(){
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
            })
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


$scope.loginSystem = function(){


  var url = Oauth.url+'new?client_id='+ Oauth.client_id + '&client_secret='+ Oauth.client_secret +'&redirect_uri=http://localhost' ;
//url="http://52.20.21.167:3500/oauth/token?client_id=5f7396418354799903da39cfbf7dbe11&client_secret=9a41e2c35f4a143f7aae1d96b8cb8e18&email=operador@smartq.com.br&password=smartquadro";
 // Open in app browser
 window.open(url,'_blank');

/*
$http({
  method: 'POST',
  url: url
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  */

};



});