/**
 * @ngdoc controller
 * @name smartq.controller: principalController
 * @description Controller principal da aplicação, responsável por fazer requisições ao servidor e atualizar as telas que mostram os dados do smart quadro ao usuário.
 */
angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService,loading,$filter,localStorageService,$location,$ionicPopup,msg){

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


  /**
   * @ngdoc method
   * @name  setState
   * @methodOf smartq.controller: principalController
   * @description Método que modifica o estado atual de um circuito(ligado/desligado)
   * @param {Number} quadro_id Identificador do quadro
   * @param {Number} circuito_id Identificador do circuito
   * @param {Boolean} estado Estado do circuito
   */
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


  /**
   * @ngdoc method
   * @name  get_color
   * @methodOf smartq.controller: principalController
   * @description Método que retorna qual a classe que deve ser aplicada nos componentes da UI do aplicativo, mudando assim a cor.
   * @param {String} color Código html da cor a ser aplicada
   */
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



  /**
   * @ngdoc method
   * @name  getServerCircuitos
   * @methodOf smartq.controller: principalController
   * @description Método que faz requisição ao servidor e salva os dados localmente dos Circuitos do usuário.
   * @param {Number} id Identificador do quadro
   */
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

  /**
   * @ngdoc method
   * @name  getUpdateCircuitos
   * @methodOf smartq.controller: principalController
   * @description Método que faz requisição ao servidor e atualiza os dados locais de circuitos do usuário.
   * @param {Number} id Identificador do circuito
   */
  function getUpdateCircuitos(id){
    smartqService.getServerCircuitos(id).then(function (json) {
        smartqService.setCircuitos(json.data);
    },function (json) {
      console.log("problema pegando circuitos");
      getUpdateCircuitos(id);
    });

  }


  /**
   * @ngdoc method
   * @name  getServerAgendamentos
   * @methodOf smartq.controller: principalController
   * @description Método que faz requisição ao servidor e salva os dados localmente dos agendamentos do usuário.
   * @param {Number} id Identificador do quadro
   */
  function getServerAgendamentos(id) {
    smartqService.getServerAgendamentos(id).then(function (json) {
        smartqService.setAgendamentos(json.data);
        getServerControle($scope.app._quadroAtual);
    },function (json) {
        getServerAgendamentos(id);
        console.log("problema pegando agendamentos");
    });
  }


  /**
   * @ngdoc method
   * @name  getServerControle
   * @methodOf smartq.controller: principalController
   * @description Método que faz requisição ao servidor e salva os dados localmente dos controles de demanda do usuário.
   * @param {Number} id Identificador do quadro
   */
  function getServerControle(id) {
    smartqService.getServeControle(id).then(function (json) {
        smartqService.setControle(json.data);
        getServeQuadroDetails($scope.app._quadroAtual);
    },function (argument) {
        getServerControle(id);
    });
  }



  /**
   * @ngdoc method
   * @name  getServerQuadroDetails
   * @methodOf smartq.controller: principalController
   * @description Método que faz requisição ao servidor e salva os dados localmente das informações de um quadro específico do usuário.
   * @param {Number} id Identificador do quadro
   */
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

  /**
   * @ngdoc method
   * @name  changeSlide
   * @methodOf smartq.controller: principalController
   * @description Método que identifica que o carrossel foi utilizado e muda a descrição apresentada na UI
   * @param {Number} index Índice no array que indica o slide atualmente no centro
   */
  $scope.changeSlide=function(index){
      $scope.app.description=$scope.app.slides[index].description;
  };

  /**
   * @ngdoc method
   * @name  changeQuadro
   * @methodOf smartq.controller: principalController
   * @description Método que identifica que o quadro atual foi modificado e dará início ao processo de fazer as requisições da informações para o novo quadro desejado.
   * @param {Number} index Índice do quadro atualmente selecionado
   */
  $scope.changeQuadro=function(index){
      smartqService.set_slide_position(index);
      $scope.app._quadroAtual=$scope.app.slides[index].id;
      $scope.app.color = get_color($scope.app.slides[index].color);
      getServerCircuitos($scope.app._quadroAtual);
  };

  /**
   * @ngdoc method
   * @name  graficoQuadro
   * @methodOf smartq.controller: principalController
   * @description Método que modifica o visível entre os dois gráficos de detalhes dos quadros.
   * @param {Boolean} value Indica qual o gráfico que deve ser visível atualmente
   */
  $scope.graficoQuadro=function (value) {
      $scope.app.mostra_grafico_quadro  = value;
  };

  /**
   * @ngdoc method
   * @name  graficoCircuito
   * @methodOf smartq.controller: principalController
   * @description Método que modifica o visível entre os dois gráficos de detalhes dos circuitos.
   * @param {Boolean} value Indica qual o gráfico que deve ser visível atualmente
   */
  $scope.graficoCircuito=function (value) {
      $scope.app.mostra_grafico_circuito  = value;
  };

  /* MODAL CONFIGURAÇÕES*/
  $ionicModal.fromTemplateUrl('templates/modal/config.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.configModal = modal;
  });

  /**
   * @ngdoc method
   * @name  openConfig
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de configurações
   */
  $scope.openConfig= function(){
    smartqService.getServerNotifications().then(function (json) {
        $scope.app.notificacao=json.data;
        $scope.configModal.show();
      },function (argument) {
        $scope.app.notificacao=[];
        $scope.configModal.show();
      });
  };

  /**
   * @ngdoc method
   * @name  logout
   * @methodOf smartq.controller: principalController
   * @description Método que faz o logout do usuário na aplicação
   */
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

  /**
   * @ngdoc method
   * @name  openNotification
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de notificações
   */
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

  /**
   * @ngdoc method
   * @name  openDetailsCircuits
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de detalhes dos circuitos
   * @param {Number} quadro_id Identificador do quadro
   * @param {Number} id Identificador do circuito
   */
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

  /**
   * @ngdoc method
   * @name  openquadros
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de detalhes do quadro
   */
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



  /**
   * @ngdoc method
   * @name  closeAll
   * @methodOf smartq.controller: principalController
   * @description Fecha todos os modais com menu(circuito,controle,agendamento)
   */
  $scope.closeAll=function () {
      $scope.circuitosModal.hide();
      $scope.controleModal.hide();
      $scope.agendamentoModal.hide();
  };

  /**
   * @ngdoc method
   * @name  abreCircuitos
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de circuito
   */
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

  /**
   * @ngdoc method
   * @name  abreControle
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de controle
   */
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

  /**
   * @ngdoc method
   * @name  abreAgendamento
   * @methodOf smartq.controller: principalController
   * @description Abre o modal de agendamento
   */
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

});