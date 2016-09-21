
angular.module('smartq').controller('circuitosController', function($scope, $ionicModal,smartqService,$filter, $ionicPopup,msg){


  $scope.app.circuitos = $filter('orderBy')(smartqService.getCircuitos(), "percent",true);
  $scope.app.quadro    = smartqService.getQuadroAtual();
  $scope.app.has_data  = true;
  $scope.app.msg       = msg.ERROR.no_circuitos;

  if ( $scope.app.circuitos === null || $scope.app.circuitos.length ===0) {
    $scope.app.has_data=false;
  }

  $scope.app.circuitoAtual           = {};
  $scope.app.mostra_grafico_circuito = true;
  $scope.app.series                  = ['POTENCIA'];
  $scope.datasetOverride             = [
    {
        label           : "Consumo(R$)",
        borderWidth     : 1,
        backgroundColor : "rgba(51, 204, 51,0.4)",
        borderColor     : "rgba(51, 204, 51,1)",
        type            : 'bar'
    },
    {
        label           : "Previsão(R$)",
        borderWidth     : 1,
        backgroundColor : "rgba(51, 51, 255,0.4)",
        borderColor     : "rgba(51, 51, 255,1)",
        type            : 'bar'
    },
    {
        label                : "Meta(R$)",
        borderWidth          : 3,
        spanGaps             : "false",
        pointBackgroundColor : "red",
        backgroundColor      : "rgba(51, 51, 255,0)",
        pointBorderWidth     : 1,
        pointHoverRadius     : 1,
        type                 : 'line'
    }
    ];



// MODAL DOS DETALHES DOS CIRCUiTOS
$ionicModal.fromTemplateUrl('templates/modal/circuitos-details.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.circuitosDetailsModal = modal;
});


// MODIFICA O ESTADO DO CIRCUITO
$scope.setState=function (quadro_id,circuito_id,estado) {

  if (estado===true) {
    estado=1;
  }
  else{
    estado=2;
  }
  var confirmPopup = $ionicPopup.confirm({
   title: 'Modificar estado',
   template: 'Você desja realmente executar esta ação?'
 });
  confirmPopup.then(function(res) {
   if(res) {
       //envia dado para o servidor
       console.log("O circuito "+circuito_id+" do quadro "+quadro_id+" foi para o estado "+estado+" enviando para o servidor...");

      smartqService.setEstadoCircuito(quadro_id,circuito_id,estado).then(function (json) {
        console.log(json.data);
        if (json.data.Actuation=="OK") {
          var alertPopup = $ionicPopup.alert({
            title: 'Circuito',
            template: 'Operação realizada com sucesso!'
          });
        }
      },function (json) {
        var alertPopup = $ionicPopup.alert({
            title: 'Circuito',
            template: 'Erro durante o processo!'
          });
        });





   } else {
      //mantém formato atual
      $scope.app.circuitos=smartqService.getCircuitos();
    }
  });

//TODO: Colocar para pegar os circuitos após setar o estado


};



$scope.graficoCircuito=function (value) {
        $scope.app.mostra_grafico_circuito  = value;
    };

$scope.openDetailsCircuits= function(quadro,id){
  smartqService.getServeCircuitoDetails(quadro,id).then(function (json) {
            smartqService.setCircuitoAtual(json);
            $scope.app.circuitoAtual=smartqService.getCircuitoAtual();
            $scope.circuitosDetailsModal.show();
  });
};



});