angular.module('smartq').controller('controleController',  function($scope, $ionicModal,smartqService){

  $scope.app.controle=smartqService.getControle();
  $scope.app.quadro=smartqService.getQuadroAtual();
  $scope.app.has_data=true;

  $scope.app.dado=[];

$scope.$watch(function () { return smartqService.getControle(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.app.controle = newValue;
});

$scope.$watch(function () { return smartqService.getQuadroAtual(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.app.quadro = newValue;
});


  if ( $scope.app.controle.saved_circuits === null || $scope.app.controle.saved_circuits.length ===0) {
    $scope.app.has_data=false;
  } else {
    console.log($scope.app.controle);

    for (var i = 0; i < $scope.app.controle.saved_circuits.length; i++) {
          $scope.app.dado.push({});
          $scope.app.dado[i].name     = $scope.app.controle.saved_circuits[i].name;
          $scope.app.dado[i].value    = parseFloat($scope.app.quadro.consumer_type.tax*$scope.app.controle.saved_circuits[i].total_energy).toFixed(2);
          $scope.app.dado[i].reais    = parseInt( $scope.app.controle.saved_circuits[i].value);
          $scope.app.dado[i].centavos = parseInt(parseFloat( $scope.app.controle.saved_circuits[i].value -  $scope.app.dado[i].reais).toFixed(2)*100);
          if ($scope.app.dado[i].centavos<10) {
              $scope.app.dado[i].centavos="0"+$scope.app.dado[i].centavos;
          }

          for(var j=0; j<$scope.app.controle.consumption_controls.length; j++) {
            if($scope.app.controle.consumption_controls[j].circuit_id === $scope.app.controle.saved_circuits[i].id) {
                $scope.app.dado[i].value_goal    = parseFloat($scope.app.controle.consumption_controls[j].threshold).toFixed(2);
                $scope.app.dado[i].reais_goal    = parseInt( $scope.app.dado[i].value_goal);
                $scope.app.dado[i].centavos_goal = parseInt(parseFloat( $scope.app.dado[i].value_goal -  $scope.app.dado[i].reais_goal).toFixed(2)*100);
                if ($scope.app.dado[i].centavos_goal<10) {
                  $scope.app.dado[i].centavos_goal="0"+$scope.app.dado[i].centavos_goal;
                }
                if ($scope.app.controle.consumption_controls[j].always) {
                  $scope.app.dado[i].date="todo mês"
                } else {
                  var data=$scope.app.controle.consumption_controls[j].expiration_date.split("T")[0];
                  data=data.split("-");
                  $scope.app.dado[i].date="até "+data[2]+"/"+data[1]+"/"+data[0];
                }

            }
          }
        $scope.app.dado[i].percent=Math.round($scope.app.dado[i].value/$scope.app.dado[i].value_goal*100);

    }
  }

});