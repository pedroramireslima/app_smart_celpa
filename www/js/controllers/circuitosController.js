angular.module('smartq').controller('circuitosController', function($scope, $ionicModal){


 $scope.labels = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL','AGO','SET','OUT','NOV','DEZ'];
  $scope.series = ['POTENCIA'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40,28, 48, 40, 19, 86]
  ];


    /* MODAL DOS DETALHES DOS CIRCUiTOS */
    $ionicModal.fromTemplateUrl('templates/modal/circuitos-details.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.circuitosDetailsModal = modal;
    });


    $scope.openDetailsCircuits= function(){
//pega os dados para mostrar e abre modal de detalhes dos circuitos
$scope.circuitosDetailsModal.show();
};






});