
angular.module('smartq').controller('circuitosController', function($scope, $ionicModal,smartqService,$filter, $ionicPopup){


  $scope.app.circuitos               = smartqService.getCircuitos();
  //console.log($scope.app.circuitos);
  $scope.app.quadro                  = smartqService.getQuadroAtual();
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
      console.log('You are not sure');
    }
  });





//TODO: Colocar para pegar os circuitos após setar o estado


};



$scope.graficoCircuito=function (value) {
        $scope.app.mostra_grafico_circuito  = value;
    };


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




            json.data.last_measure.power_factor           = parseFloat(json.data.last_measure.power_factor).toFixed(2);
            json.data.last_measure.current                = Math.round(json.data.last_measure.current);
            json.data.last_measure.import_active_energy   = parseFloat(json.data.last_measure.import_active_energy).toFixed(2);
            json.data.last_measure.import_reactive_energy = parseFloat(json.data.last_measure.import_reactive_energy).toFixed(2);
            json.data.last_measure.line_frequency         = parseFloat(json.data.last_measure.line_frequency).toFixed(2);
            json.data.goal_tuple                          = smartqService.convertTupla( json.data.goal_tuple);
            json.data.previsions_c_tuple_money            = smartqService.convertTupla( json.data.previsions_c_tuple_money);
            json.data.measures_c_tuple[0]                 = json.data.measures_c_tuple[0].map(function(obj){var a   = new Date(obj); return a.getDate();});
            json.data.measures_c_tuple_diff[0]            = json.data.measures_c_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
            json.data.measures_c_tuple_diff[1]            = json.data.measures_c_tuple_diff[1];
            json.data.goal_tuple[0]                       = json.data.goal_tuple[0].map(function(obj){var a  = new Date(obj); return a.getDate();});
            var dia                               = new Date();
            dia                                   = dia.getDate();
            var vec                               = [0,0,0,0];
            var a                                 = json.data.goal_tuple[0].indexOf(dia);
            json.data.goal_tuple[0]               = json.data.goal_tuple[0].slice(a-3,a+4);
            json.data.measures_c_tuple[1]         = json.data.measures_c_tuple[1].slice(a-3,a+4);
            json.data.previsions_c_tuple_money[1] = vec.concat(json.data.previsions_c_tuple_money[1].slice(0,3));
            json.data.previsions_c_tuple_money[1] = json.data.previsions_c_tuple_money[1].map(Math.round);
            json.data.goal_tuple[1]               = json.data.goal_tuple[1].slice(a-3,a+4);
            json.data.measures_c_tuple_diff[1]    = json.data.measures_c_tuple_diff[1].slice(a-3,a+4);
            json.data.measures_c_tuple_diff[0]    = json.data.measures_c_tuple_diff[0].slice(a-3,a+4);

            console.log(json.data);
            smartqService.setCircuitoAtual(json.data);
            $scope.app.circuitoAtual=smartqService.getCircuitoAtual();

            $scope.circuitosDetailsModal.show();

  });

};



});