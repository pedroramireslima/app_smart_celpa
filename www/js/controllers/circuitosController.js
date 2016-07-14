
angular.module('smartq').controller('circuitosController', function($scope, $ionicModal,smartqService){

  //$scope.app={};
  $scope.app.circuitos=smartqService.getCircuitos();
  $scope.app.quadro=smartqService.getQuadroAtual();
  $scope.app.circuitoAtual={};
$scope.app.series = ['POTENCIA'];
console.log("circuitos");

for (var i = 0; i < $scope.app.circuitos.length; i++) {
  $scope.app.circuitos[i].value =parseFloat($scope.app.quadro.consumer_type.tax*$scope.app.circuitos[i].total_energy).toFixed(2);
  $scope.app.circuitos[i].reais=parseInt( $scope.app.circuitos[i].value);
     $scope.app.circuitos[i].centavos=parseInt(parseFloat( $scope.app.circuitos[i].value -  $scope.app.circuitos[i].reais).toFixed(2)*100);
if ($scope.app.circuitos[i].centavos<10) {
  $scope.app.circuitos[i].centavos="0"+$scope.app.circuitos[i].centavos;
}
$scope.app.circuitos[i].percent=Math.round($scope.app.circuitos[i].total_energy/$scope.app.quadro.break_panel.total_energy*100);

}



/* MODAL DOS DETALHES DOS CIRCUiTOS */
$ionicModal.fromTemplateUrl('templates/modal/circuitos-details.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.circuitosDetailsModal = modal;
});


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
    json.data.measures_c_tuple[0]=json.data.measures_c_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});
json.data.measures_c_tuple[1]=[json.data.measures_c_tuple[1]];

    json.data.measures_c_tuple_diff[0]=json.data.measures_c_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
    json.data.measures_c_tuple_diff[1]=[json.data.measures_c_tuple_diff[1]];
    json.data.goal_tuple[0]=json.data.goal_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});
    json.data.goal_tuple[1]=[json.data.goal_tuple[1]];

    smartqService.setCircuitoAtual(json.data);
    $scope.app.circuitoAtual=smartqService.getCircuitoAtual();

    $scope.circuitosDetailsModal.show();

  });

};



});