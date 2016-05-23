angular.module('smartq').controller('circuitosController', function($scope, $ionicModal){


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