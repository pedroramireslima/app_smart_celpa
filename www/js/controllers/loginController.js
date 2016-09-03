/**
*  Controller da tela de login
*/
angular.module('smartq').controller('loginController', function($scope,$http,smartqService,loading,$location,config,$cordovaInAppBrowser,$rootScope){



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
    // success
  })
  .catch(function(event) {
    // error
  });

  $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
    console.log("evento disparadoem 1: "+event.url);
    if((event.url).startsWith("http://localhost/callback")) {
    console.log("COMEÇOU<<<<<<<<<<<<<<<<<<");
    $cordovaInAppBrowser.close();
    }

  });


  //var ref = cordova.InAppBrowser.open(config.SERVER.url+':'+config.SERVER.port+'/oauth/new?client_id=' + config.OAUTH80.client_id + '&client_secret='+config.OAUTH80.client_secret+'&redirect_uri=http://localhost/callback', '_blank', 'location=no');


/*

  ref.addEventListener('loadstart', function(event) {

    if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) === 0;
            };
    }

    if((event.url).startsWith("http://localhost/callback")) {
      //var requestToken = (event.url).split("code=")[1];

      var alertPopup = $ionicPopup.alert({
          title: 'Teste',
          template: 'O código é:'+requestToken
      });


      ref.close();
    }
  });
*/


//$cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)



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