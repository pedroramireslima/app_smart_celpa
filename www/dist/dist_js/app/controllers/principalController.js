angular.module('smartq').controller('principalController', ['$scope', '$ionicModal', 'smartqService', 'loading', '$filter', 'localStorageService', '$location', '$ionicPopup', 'msg', function($scope, $ionicModal,smartqService,loading,$filter,localStorageService,$location,$ionicPopup,msg){
    loading.show();

    $scope.app                 = {};
    $scope.app.slides          = smartqService.getQuadros();
    $scope.app.description     = $scope.app.slides[smartqService.get_slide_position()].description;
    $scope.app._quadroAtual    = $scope.app.slides[smartqService.get_slide_position()].id;
    $scope.app.color           = get_color($scope.app.slides[smartqService.get_slide_position()].color);
    $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
    $scope.app.circuitoAtual   = {};
    $scope.app.mostra_grafico_quadro   = true;
    $scope.app.mostra_grafico_circuito = true;
    $scope.app.notifications    = [];
    $scope.app.msg_circuito     = msg.ERROR.no_circuitos;
    $scope.app.msg_controle     = msg.ERROR.no_controle;
    $scope.app.msg_agendamentos = msg.ERROR.no_agendamentos;


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
   template: msg.ERROR.confirm
 });
  confirmPopup.then(function(res) {
    if(res) {
       //envia dado para o servidor
       console.log("O circuito "+circuito_id+" do quadro "+quadro_id+" foi para o estado "+estado+" enviando para o servidor...");
      smartqService.setEstadoCircuito(quadro_id,circuito_id,estado).then(function (json) {
        if (json.data.Actuation=="OK") {
          var alertPopup = $ionicPopup.alert({
            title: 'Circuito',
            template: msg.ERROR.sucess
          });
        }
      },function (json) {
        var alertPopup = $ionicPopup.alert({
            title: 'Circuito',
            template: msg.ERROR.failure
          });
      });
      $scope.abreCircuitos();
    } else {
      $scope.abreCircuitos();
    }
  });

};


$scope.app.options  = {
    'visible'     : 5,
    'perspective' : 35,
    'startSlide'  : 0,
    'border'      : 3,
    'dir'         : 'ltr',
    'width'       : 200,
    'height'      : 250,
    'space'       : 120
};

    function get_color(color) {
      if (color=='8b51ce') {
        return 'lilas';
      } else if(color=='40b5d2'){
        return 'azul_claro';
      } else if(color=='42d19d'){
        return 'verde_claro';
      } else if(color=='87d438'){
        return 'verde_escuro';
      } else if(color=='4250d1'){
        return 'azul_escuro';
      } else if(color=='ce4ea7'){
        return 'rosa';
      } else if(color=='db9249'){
        return 'laranja';
      } else if(color=='e04444'){
        return 'vermelho';
      }
    }

    $scope.datasetOverride = [
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



    /*FUNÇÃO QUE PEGA CIRCUITO*/
    function getServerCircuitos(id){
      loading.show();
      smartqService.getServerCircuitos(id).then(function (json) {
          smartqService.setCircuitos(json.data);
          getServerAgendamentos($scope.app._quadroAtual);
      },function (json) {
        console.log("problema pegando circuitos");
        getServerCircuitos(id);
      });

    }

    /*FUNÇÃO QUE ATUALIZA CIRCUITO*/
    function getUpdateCircuitos(id){
      smartqService.getServerCircuitos(id).then(function (json) {
          smartqService.setCircuitos(json.data);
      },function (json) {
        console.log("problema pegando circuitos");
        getUpdateCircuitos(id);
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
      });
    }


    /*FUNÇÃO QUE PEGA CONTROLE DOS CIRCUITOS*/
    function getServerControle(id) {
      smartqService.getServeControle(id).then(function (json) {
          smartqService.setControle(json.data);

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
      },function (json) {
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
        smartqService.set_slide_position(index);
        $scope.app._quadroAtual=$scope.app.slides[index].id;
        $scope.app.color = get_color($scope.app.slides[index].color);
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

    /*Abre configurações*/
    $scope.openConfig= function(){
      smartqService.getServerNotifications().then(function (json) {
          $scope.app.notificacao=json.data;
          $scope.configModal.show();
        },function (argument) {
          $scope.app.notificacao=[];
          $scope.configModal.show();
        });


    };

    $scope.logout = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Sair',
        template: 'Você desja realmente executar esta ação?'
      });
      confirmPopup.then(function(res) {
      if (res) {
        localStorageService.clearAll();
        $location.path( "login");
        $scope.configModal.hide();
      }
      });

    };


    /* MODAL Notification*/
    $ionicModal.fromTemplateUrl('templates/modal/notifications.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.notificationModal = modal;
    });


    $scope.openNotification= function(){
        for (var i = $scope.app.notificacao.length - 1; i >= 0; i--) {
          $scope.app.notificacao[i].message=$scope.app.notificacao[i].message.replace(/<strong>/g,"");
          $scope.app.notificacao[i].message=$scope.app.notificacao[i].message.replace(/<\/strong>/g,"");
        }
        $scope.app.notificacao=$scope.app.notificacao;
        $scope.notificationModal.show();
        console.log($scope.app.notificacao);
        smartqService.clearNotification().then(function (json) {
          console.log(json.data);
        },function (argument) {
          console.log("erro aqui"+argument);
        });
    };



    /* MODAL DOS DETALHES DOS CIRCUiTOS */
    $ionicModal.fromTemplateUrl('templates/modal/circuitos-details.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.circuitosDetailsModal = modal;
    });


$scope.openDetailsCircuits= function(quadro,id){
  smartqService.getServeCircuitoDetails(quadro,id).then(function (json) {
    smartqService.setCircuitoAtual(json);
    $scope.app.circuitoAtual=smartqService.getCircuitoAtual();
    $scope.app.circuito_trifasico=true;
    console.log($scope.app.circuitoAtual.last_measure.voltage_ab);
    if ($scope.app.circuitoAtual.last_measure.voltage_ab==='-') {
      $scope.app.circuito_trifasico=false;
    }
    $scope.circuitosDetailsModal.show();
  });
};



  /* MODAL  QUADROS */
  $ionicModal.fromTemplateUrl('templates/modal/quadros_details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.quadrosModal = modal;
  });


$scope.openQuadros= function(){
  $scope.app.color = get_color($scope.app.slides[smartqService.get_slide_position()].color);
  $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
  $scope.app.quadro_detalhes.circuitos=$filter('orderBy')($scope.app.quadro_detalhes.circuitos, "percent",true);
  $scope.quadrosModal.show();
};



/* MODAL DOS  CIRCUiTOS */
    $ionicModal.fromTemplateUrl('templates/modal/circuitos.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.circuitosModal = modal;
  });

/* MODAL DO  CONTROLE */
    $ionicModal.fromTemplateUrl('templates/modal/controle.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.controleModal = modal;
  });

/* MODAL DO  AGENDAMENTO */
    $ionicModal.fromTemplateUrl('templates/modal/agendamento.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.agendamentoModal = modal;
  });




$scope.closeAll=function () {
    $scope.circuitosModal.hide();
    $scope.controleModal.hide();
    $scope.agendamentoModal.hide();
};

$scope.abreCircuitos=function () {
  getUpdateCircuitos($scope.app._quadroAtual);
  $scope.app.quadro    = smartqService.getQuadroAtual();
  $scope.app.circuitos = $filter('orderBy')(smartqService.getCircuitos(), "percent",true);
  $scope.app.has_data_circuito  = true;
  if ( $scope.app.circuitos === null || $scope.app.circuitos.length ===0) {
    $scope.app.has_data_circuito=false;
  }
    $scope.circuitosModal.show();
    $scope.controleModal.hide();
    $scope.agendamentoModal.hide();
};

$scope.abreControle=function () {
  $scope.app.quadro    = smartqService.getQuadroAtual();
  $scope.app.has_data_controle=true;
  $scope.app.controle=smartqService.getControle();
  if ( $scope.app.controle.saved_circuits === null || $scope.app.controle.saved_circuits.length ===0) {
        $scope.app.has_data_controle=false;
  }
  $scope.app.dado=smartqService.trata_controle($scope.app.controle);
  $scope.circuitosModal.hide();
  $scope.controleModal.show();
  $scope.agendamentoModal.hide();
};

$scope.abreAgendamento=function () {
  $scope.app.agendamentos=smartqService.getAgendamentos();
  $scope.app.has_data_agendamentos=true;
  if ( $scope.app.agendamentos.ids === null || $scope.app.agendamentos.ids.length ===0) {
      $scope.app.has_data_agendamentos=false;
  }
  $scope.circuitosModal.hide();
  $scope.controleModal.hide();
  $scope.agendamentoModal.show();
};


  loading.hide();

}]);