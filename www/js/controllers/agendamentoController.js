angular.module('smartq').controller('agendamentoController',  function($scope, $ionicModal,smartqService){

$scope.agendamentos={};
$scope.agendamentos.dados=smartqService.getAgendamentos();


});