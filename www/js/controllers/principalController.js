angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService,loading){

    loading.show();
    $scope.app={"slides":[],"description":"","options":{}};
    $scope.quadro_detalhes={};


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

        smartqService.getServerQuadros()
        .then(function(json){
           smartqService.setQuadros(json.data);
           $scope.app.slides=smartqService.getQuadros();
           $scope.app.description=$scope.app.slides[0].description;
           _quadroAtual=$scope.app.slides[0].id;
           getServerCircuitos(_quadroAtual);


       },function(){
        loading.hide();
        console.log("problema");
        getServeQuadros();
    });

    }


    /*FUNÇÃO QUE PEGA CIRCUITO*/
    function getServerCircuitos(id){
loading.show();
        smartqService.getServerCircuitos(id).then(function (json) {
            smartqService.setCircuitos(json.data);
            getServeQuadroDetails(_quadroAtual);
        },function (json) {
            getServerCircuitos(id);
            console.log("problema pegando circuitos");
        });

    }


    /*FUNÇÃO QUE PEGA DETALHES DO QUADRO ATUAL*/
    function getServeQuadroDetails(id){
        smartqService.getServerQuadrosDetails(id).then(function (json) {
            smartqService.setQuadroAtual(json.data);
             $scope.quadro_detalhes=smartqService.quadrosDetalhes();//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
             console.log($scope.quadro_detalhes);
             loading.hide();
         },function (json) {
            loading.hide();
            console.log("problema pegando quadros");
            getServeQuadroDetails(id);
        });



    }



    /*FUNÇÃO QUE DETECTA SE SLIDE MODIFICOU*/

    $scope.changeSlide=function(index){
        $scope.app.description=$scope.app.slides[index].description;
    }


    /*FUNÇÃO QUE MODIFICA O QUADRO ATUAL*/
    $scope.changeQuadro=function(index){
        _quadroAtual=$scope.app.slides[index].id;
        getServerCircuitos(_quadroAtual);
        getServeQuadroDetails(_quadroAtual);

        smartqService.quadrosDetalhes();
    }






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


//TODO: Correção dos modais não atualizando


/* MODAL  QUADROS */
$ionicModal.fromTemplateUrl('templates/modal/quadros.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.quadrosModal = modal;
});


$scope.openQuadros= function(){
    $scope.quadrosModal.show();
};

$scope.closeQuadros= function(){
    $scope.quadrosModal.hide();


};


//inicializa tela com dados do server
getServeQuadros() ;




}
);