angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService,loading){



    $scope.app={};
    $scope.app.slides=[];
    $scope.description={};
    $scope.quadro_atual={};

 $scope.quadrosModal={};

    $scope.app.options = {
        visible: 5,
        perspective: 35,
        startSlide: 0,
        border: 3,
        dir: 'ltr',
        width: 200,
        height: 250,
        space: 120
    };

    var _quadroAtual=0;

    /*FUNÇÕES QUE PEGA DADOS DOS SLIDES DO SERVER E EXIBE*/

    function getServeQuadros() {
        loading.show();

        smartqService.getServerQuadros()
        .then(function(json){
         smartqService.setQuadros(json.data);
           // console.log(smartqService.getQuadros());
           $scope.app.slides=smartqService.getQuadros();
           $scope.description=$scope.app.slides[0].description;
           _quadroAtual=$scope.app.slides[0].id;
           getServerCircuitos(_quadroAtual);
           getServeQuadroDetails(_quadroAtual);
           loading.hide();
       },function(){
        console.log("problema");
        getServeQuadros();
    });

    }


    /*FUNÇÃO QUE PEGA CIRCUITO*/
    function getServerCircuitos(id){
        //loading.show();

        smartqService.getServerCircuitos(id).then(function (json) {
            smartqService.setCircuitos(json.data);
            loading.hide();
        },function (json) {
            getServerCircuitos(id);
  console.log("problema pegando circuitos");
        });

    }

    /*FUNÇÃO QUE PEGA DETALHES DO QUADRO ATUAL*/
    function getServeQuadroDetails(id){
        //loading.show();
        smartqService.getServerQuadrosDetails(id).then(function (json) {
            smartqService.setQuadroAtual(json.data);
            $scope.quadro_atual=smartqService.getQuadroAtual();
            $scope.quadro_atual.percent=$scope.quadro_atual.break_panel.total_energy / $scope.quadro_atual.break_panel.goal * $scope.quadro_atual.consumer_type.tax * 100;
            $scope.quadro_atual.percent=parseFloat($scope.quadro_atual.percent).toFixed(2);
            if ( $scope.quadro_atual.percent==Infinity) {
                $scope.quadro_atual.percent="-";
            }
             $scope.quadro_atual.goal_money=$scope.quadro_atual.break_panel.goal * $scope.quadro_atual.consumer_type.tax ;

            console.log($scope.quadro_atual);
            //console.log($scope.quadro_atual.percent);
        },function (json) {
              console.log("problema pegando quadros");
            getServeQuadroDetails(id);
        });



    }



    /*FUNÇÃO QUE DETECTA SE SLIDE MODIFICOU*/

    $scope.changeSlide=function(index){
        $scope.description=$scope.app.slides[index].description;
    }

    /*FUNÇÃO QUE MODIFICA O QUADRO ATUAL*/
    $scope.changeQuadro=function(index){
        _quadroAtual=$scope.app.slides[index].id;
        getServerCircuitos(_quadroAtual);
        getServeQuadroDetails(_quadroAtual);
    }





$scope.labels = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL','AGO','SET','OUT','NOV','DEZ'];
$scope.series = ['POTENCIA'];

$scope.data = [
[65, 59, 80, 81, 56, 55, 40,28, 48, 40, 19, 86]
];



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


/* MODAL  QUADROS */

$ionicModal.fromTemplateUrl('templates/modal/quadros.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.quadrosModal = modal;
});




$scope.openQuadros= function(){
    //pega os dados para mostrar e abre modal de detalhes dos circuitos
 $scope.quadrosModal.show();
};

$scope.closeQuadros= function(){
        $scope.quadrosModal.hide();

    //$scope.quadrosModal.remove();
     $scope.currentUrl = {};
};


//inicializa tela com dados do server
getServeQuadros() ;




}
);