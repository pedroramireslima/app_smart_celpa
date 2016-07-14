angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService,loading){
    loading.show();

    $scope.app={};
    $scope.app.slides = smartqService.getQuadros();
    $scope.app.description = $scope.app.slides[0].description;
    $scope.app. _quadroAtual = $scope.app.slides[0].id;
    $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
    $scope.app.options = {
        'visible': 5,
        'perspective': 35,
        'startSlide': 0,
        'border': 3,
        'dir': 'ltr',
        'width': 200,
        'height': 250,
        'space': 120
    };

console.log($scope.app);



    /*FUNÇÃO QUE PEGA CIRCUITO*/
    function getServerCircuitos(id){
        loading.show();
        smartqService.getServerCircuitos(id).then(function (json) {

            smartqService.setCircuitos(json.data);
            getServeQuadroDetails($scope.app._quadroAtual);
        },function (json) {
            getServerCircuitos(id);
            console.log("problema pegando circuitos");
        });

    }



    /*FUNÇÃO QUE PEGA DETALHES DO QUADRO ATUAL*/
    function getServeQuadroDetails(id){
        smartqService.getServerQuadrosDetails(id).then(function (json) {

            smartqService.setQuadroAtual(json.data);

            loading.hide();
            $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
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
        $scope.app.quadro_detalhes = smartqService.quadrosDetalhes();
            console.log($scope.app.quadro_detalhes);
        $scope.quadrosModal.show();
    };



    loading.hide();




}
);