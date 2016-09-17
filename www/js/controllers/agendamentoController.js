angular.module('smartq').controller('agendamentoController',  function($scope, $ionicModal,smartqService){

$scope.agendamentos={};
$scope.agendamentos.dados=smartqService.getAgendamentos();

$scope.$watch(function () { return smartqService.getAgendamentos(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.agendamentos.dados = newValue;
});

$scope.app.has_data=true;
console.log($scope.agendamentos.dados);
if ( $scope.agendamentos.dados.ids === null || $scope.agendamentos.dados.ids.length ===0) {
    $scope.app.has_data=false;
  }

});