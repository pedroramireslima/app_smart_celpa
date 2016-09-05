angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService,loading,$filter,localStorageService,$location){
    loading.show();

    $scope.app                         = {};
    $scope.app.slides                  = smartqService.getQuadros();
    $scope.app.description             = $scope.app.slides[0].description;
    $scope.app._quadroAtual            = $scope.app.slides[0].id;
    $scope.app.quadro_detalhes         = smartqService.quadrosDetalhes();
    $scope.app.circuitoAtual           = {};
    $scope.app.mostra_grafico_quadro   = true;
    $scope.app.mostra_grafico_circuito = true;
    $scope.app.options                 = {
        'visible'     : 5,
        'perspective' : 35,
        'startSlide'  : 0,
        'border'      : 3,
        'dir'         : 'ltr',
        'width'       : 200,
        'height'      : 250,
        'space'       : 120
    };




    $scope.datasetOverride = [
    {
        label           : "Medição(R$)",
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
        label                : "Desejado(R$)",
        borderWidth          : 3,
        spanGaps             : "false",
        pointBackgroundColor : "red",
        backgroundColor      : "rgba(51, 51, 255,0)",
        pointBorderWidth     : 1,
        pointHoverRadius     : 1,
        type                 : 'line'
    }
    ];



    /*FUNÇÃO QUE PEGA CIRCUITO*/
    function getServerCircuitos(id){
            loading.show();
            smartqService.getServerCircuitos(id).then(function (json) {

                smartqService.setCircuitos(json.data);
                getServerAgendamentos($scope.app._quadroAtual);

            },function (json) {
                getServerCircuitos(id);
                console.log("problema pegando circuitos");
            });

    }

    /*FUNÇÃO QUE PEGA OS AGENDAMENTOS DO QUADRO*/
    function getServerAgendamentos(id) {
            smartqService.getServerAgendamentos(id).then(function (json) {
                smartqService.setAgendamentos(json.data);
                getServerControle($scope.app._quadroAtual);

            },function (json) {
                getServerAgendamentos(id);
                console.log("problema pegando agendamentos");
            })
    }


    /*FUNÇÃO QUE PEGA CONTROLE DOS CIRCUITOS*/
    function getServerControle(id) {
        smartqService.getServeControle(id).then(function (json) {
            smartqService.setControle(json.data);

 //           console.log(json.data.available_circuits);
            getServeQuadroDetails($scope.app._quadroAtual);
        },function (argument) {
            getServerControle(id);
        });
    }



    /*FUNÇÃO QUE PEGA DETALHES DO QUADRO ATUAL*/
    function getServeQuadroDetails(id){
        smartqService.getServerQuadrosDetails(id).then(function (json) {


            smartqService.setQuadroAtual(json.data);

            $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();


            loading.hide();

            //console.log($scope.app.quadro_detalhes);
        },function (json) {
           // loading.hide();
           console.log("problema pegando quadros");
           getServeQuadroDetails(id);
       });



    }

    /*FUNÇÃO QUE DETECTA SE SLIDE MODIFICOU*/

    $scope.changeSlide=function(index){
        $scope.app.description=$scope.app.slides[index].description;
    };


    /*FUNÇÃO QUE MODIFICA O QUADRO ATUAL*/
    $scope.changeQuadro=function(index){
        $scope.app._quadroAtual=$scope.app.slides[index].id;
        getServerCircuitos($scope.app._quadroAtual);

    };


     $scope.graficoQuadro=function (value) {
        $scope.app.mostra_grafico_quadro  = value;
    };

    $scope.graficoCircuito=function (value) {
        $scope.app.mostra_grafico_circuito  = value;
    };

    /* MODAL CONFIG*/
    $ionicModal.fromTemplateUrl('templates/modal/config.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.configModal = modal;
    });


    $scope.openConfig= function(){
        $scope.configModal.show();
    };

    $scope.logout = function () {
      localStorageService.clearAll();
      $location.path( "login");
      $scope.configModal.hide();
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

        json.data.measures_c_tuple      = smartqService.convertTupla( json.data.measures_c_tuple);
        json.data.measures_c_tuple_diff = smartqService.convertTupla( json.data.measures_c_tuple_diff);
        json.data.value                 = parseFloat((json.data.circuit.total_energy) *(json.data.consumer_type.tax)).toFixed(2);
        json.data.reais                 = parseInt(json.data.value);
        json.data.centavos              = parseInt(parseFloat(json.data.value - json.data.reais).toFixed(2)*100);
        if (json.data.centavos<10) {
            json.data.centavos="0"+json.data.centavos;
      }

      json.data.total                               = parseFloat((json.data.break_panel.total_energy) *(json.data.consumer_type.tax)).toFixed(2);
      json.data.percent_money                       = Math.round(json.data.value/json.data.total*100);
      json.data.percent_consumo                     = Math.round(json.data.circuit.total_energy/json.data.break_panel.total_energy*100);
      json.data.last_measure.power_factor           = parseFloat(json.data.last_measure.power_factor).toFixed(2);
      json.data.last_measure.current                = Math.round(json.data.last_measure.current);
      json.data.last_measure.import_active_energy   = parseFloat(json.data.last_measure.import_active_energy).toFixed(2);
      json.data.last_measure.import_reactive_energy = parseFloat(json.data.last_measure.import_reactive_energy).toFixed(2);
      json.data.last_measure.line_frequency         = parseFloat(json.data.last_measure.line_frequency).toFixed(2);
      json.data.goal_tuple                          = smartqService.convertTupla( json.data.goal_tuple);
      json.data.previsions_c_tuple_money            = smartqService.convertTupla( json.data.previsions_c_tuple_money);
      json.data.measures_c_tuple[0]                 = json.data.measures_c_tuple[0].map(function(obj){
        var a = new Date(obj);
         return a.getDate();});


      json.data.measures_c_tuple_diff[0]=json.data.measures_c_tuple_diff[0].map(function(obj){
        var a = new Date(obj);
         return a.getDate();});
      json.data.measures_c_tuple_diff[1]=json.data.measures_c_tuple_diff[1];
      json.data.goal_tuple[0]=json.data.goal_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});

        var dia                               = new Date;
        dia                                   = dia.getDate();
        var vec                               = [0,0,0,0];
        var a                                 = json.data.goal_tuple[0].indexOf(dia);
        json.data.goal_tuple[0]               = json.data.goal_tuple[0].slice(a-3,a+4);
        json.data.measures_c_tuple[1]         = json.data.measures_c_tuple[1].slice(a-3,a+4);
        json.data.previsions_c_tuple_money[1] = vec.concat(json.data.previsions_c_tuple_money[1].slice(0,3));
        json.data.goal_tuple[1]               = json.data.goal_tuple[1].slice(a-3,a+4);
        json.data.measures_c_tuple_diff[1]    = json.data.measures_c_tuple_diff[1].slice(a-3,a+4);
        json.data.measures_c_tuple_diff[0]    = json.data.measures_c_tuple_diff[0].slice(a-3,a+4);


      //console.log(json.data);
      smartqService.setCircuitoAtual(json.data);
      $scope.app.circuitoAtual=smartqService.getCircuitoAtual();

      $scope.circuitosDetailsModal.show();

  });

  };



  /* MODAL  QUADROS */
  $ionicModal.fromTemplateUrl('templates/modal/quadros.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.quadrosModal = modal;
});


$scope.openQuadros= function(){
    $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
    $scope.app.quadro_detalhes.circuitos=$filter('orderBy')($scope.app.quadro_detalhes.circuitos, "percent",true);
    $scope.quadrosModal.show();
};



loading.hide();




}
);