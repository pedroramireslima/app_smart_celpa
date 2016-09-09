angular.module('smartq').controller('controleController',  function($scope, $ionicModal,smartqService){

  $scope.app.controle=smartqService.getControle();
  $scope.app.quadro=smartqService.getQuadroAtual();
  $scope.app.has_data=true;
  if ( $scope.app.controle.saved_circuits === null || $scope.app.controle.saved_circuits.length ===0) {
    $scope.app.has_data=false;
  } else {
    $scope.app.controle=$scope.app.controle.saved_circuits;

          for (var i = 0; i < $scope.app.controle.length; i++) {
                $scope.app.controle[i].value    = parseFloat($scope.app.quadro.consumer_type.tax*$scope.app.controle[i].total_energy).toFixed(2);
                $scope.app.controle[i].reais    = parseInt( $scope.app.controle[i].value);
                $scope.app.controle[i].centavos = parseInt(parseFloat( $scope.app.controle[i].value -  $scope.app.controle[i].reais).toFixed(2)*100);
                if ($scope.app.controle[i].centavos<10) {
                    $scope.app.controle[i].centavos="0"+$scope.app.controle[i].centavos;
                }

                $scope.app.controle[i].value_goal    = parseFloat($scope.app.quadro.consumer_type.tax*$scope.app.controle[i].goal).toFixed(2);
                $scope.app.controle[i].reais_goal    = parseInt( $scope.app.controle[i].value_goal);
                $scope.app.controle[i].centavos_goal = parseInt(parseFloat( $scope.app.controle[i].value_goal -  $scope.app.controle[i].reais_goal).toFixed(2)*100);
                if ($scope.app.controle[i].centavos_goal<10) {
                    $scope.app.controle[i].centavos_goal="0"+$scope.app.controle[i].centavos_goal;
                }

              $scope.app.controle[i].percent=Math.round($scope.app.controle[i].value/$scope.app.controle[i].value_goal*100);

          }
  }








/* MODAL EDITAR CONTROLE */
/*
    $ionicModal.fromTemplateUrl('templates/modal/controle-edit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.controleEditModal = modal;
    });


$scope.openEditControle= function(){
//pega os dados para mostrar e abre modal de detalhes dos circuitos
$scope.controleEditModal.show();
};

*/

});