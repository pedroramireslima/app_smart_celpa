
angular.module('smartq').controller('circuitosController', function($scope, $ionicModal,smartqService,$filter, $ionicPopup){


  $scope.app.circuitos=smartqService.getCircuitos();
  $scope.app.quadro=smartqService.getQuadroAtual();
  $scope.app.circuitoAtual={};
  $scope.app.series = ['POTENCIA'];

 $scope.datasetOverride = [
    {
        label: "Medição",
        borderWidth: 1,
        type: 'bar'
    },
    {
        label: "Previsão",
        borderWidth: 1,
        type: 'bar'
    },
    {
        label: "Desejado",
        borderWidth: 3,
        type: 'line'
    }
    ];


  function formata_circuito() {
    for (var i = 0; i < $scope.app.circuitos.length; i++) {
      $scope.app.circuitos[i].value =parseFloat($scope.app.quadro.consumer_type.tax*$scope.app.circuitos[i].total_energy).toFixed(2);
      $scope.app.circuitos[i].reais=parseInt( $scope.app.circuitos[i].value);
      $scope.app.circuitos[i].centavos=parseInt(parseFloat( $scope.app.circuitos[i].value -  $scope.app.circuitos[i].reais).toFixed(2)*100);
      if ($scope.app.circuitos[i].centavos<10) {
        $scope.app.circuitos[i].centavos="0"+$scope.app.circuitos[i].centavos;
      }
      $scope.app.circuitos[i].percent=Math.round($scope.app.circuitos[i].total_energy/$scope.app.quadro.break_panel.total_energy*100);

    }

//ordena do de maior energia para o de menor energia
$scope.app.circuitos=$filter('orderBy')($scope.app.circuitos, "total_energy",true);

}

formata_circuito();



/* MODAL DOS DETALHES DOS CIRCUiTOS */
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
       console.log("O circuito "+circuito_id+" do quadro "+quadro_id+" foi para o estado "+estado);
     } else {
      //mantém formato atual

      $scope.app.circuitos=smartqService.getCircuitos();
      formata_circuito();
      console.log('You are not sure');
    }
  });




/*
 smartqService.setEstadoCircuito(quadro_id,circuito_id,estado).then(function (json) {
  if (json.data=="ok") {
    console.log("tudo certo");
  }
 },function (json) {
   console.log("Erro ");
 });*/

//TODO: Colocar para pegar os circuitos após setar o estado


};


//TODO: Colocar para pegar somente os sete

$scope.openDetailsCircuits= function(quadro,id){
  smartqService.getServeCircuitoDetails(quadro,id).then(function (json) {

    json.data.measures_c_tuple=smartqService.convertTupla( json.data.measures_c_tuple);
    json.data.measures_c_tuple_diff=smartqService.convertTupla( json.data.measures_c_tuple_diff);
    json.data.value=parseFloat((json.data.circuit.total_energy) *(json.data.consumer_type.tax)).toFixed(2);
    json.data.reais=parseInt(json.data.value);
    json.data.centavos=parseInt(parseFloat(json.data.value - json.data.reais).toFixed(2)*100);
    if (json.data.centavos<10) {
      json.data.centavos="0"+json.data.centavos;
    }

    json.data.total=parseFloat((json.data.break_panel.total_energy) *(json.data.consumer_type.tax)).toFixed(2);
    json.data.percent_money=Math.round(json.data.value/json.data.total*100);
    json.data.percent_consumo=Math.round(json.data.circuit.total_energy/json.data.break_panel.total_energy*100);




    json.data.last_measure.power_factor=parseFloat(json.data.last_measure.power_factor).toFixed(2);
    json.data.last_measure.current=Math.round(json.data.last_measure.current);
    json.data.last_measure.import_active_energy=parseFloat(json.data.last_measure.import_active_energy).toFixed(2);
    json.data.last_measure.import_reactive_energy=parseFloat(json.data.last_measure.import_reactive_energy).toFixed(2);
    json.data.last_measure.line_frequency=parseFloat(json.data.last_measure.line_frequency).toFixed(2);

    json.data.goal_tuple=smartqService.convertTupla( json.data.goal_tuple);
json.data.previsions_c_tuple_money=smartqService.convertTupla( json.data.previsions_c_tuple_money);


    json.data.measures_c_tuple[0]=json.data.measures_c_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});


    json.data.measures_c_tuple_diff[0]=json.data.measures_c_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
    json.data.measures_c_tuple_diff[1]=json.data.measures_c_tuple_diff[1];
    json.data.goal_tuple[0]=json.data.goal_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});


console.log(json.data);
    smartqService.setCircuitoAtual(json.data);
    $scope.app.circuitoAtual=smartqService.getCircuitoAtual();

    $scope.circuitosDetailsModal.show();

  });

};



});