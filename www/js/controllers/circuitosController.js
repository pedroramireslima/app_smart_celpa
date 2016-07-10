
angular.module('smartq').controller('circuitosController', function($scope, $ionicModal,smartqService){

  $scope.app={};
  $scope.app.circuitos=smartqService.getCircuitos();
 $scope.app.circuitoAtual={};
//console.log($scope.app.circuitos);


$scope.series = ['POTENCIA'];





console.log($scope.app.circuitos);

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
   json.data.goal_tuple=smartqService.convertTupla( json.data.goal_tuple);
   json.data.measures_c_tuple[0]=json.data.measures_c_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});
  json.data.measures_c_tuple_diff[0]=json.data.measures_c_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
  json.data.goal_tuple[0]=json.data.goal_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});

  smartqService.setCircuitoAtual (json.data);
  $scope.app.circuitoAtual=smartqService.getCircuitoAtual ();
  console.log(json.data);
  $scope.circuitosDetailsModal.show();

});

};



});