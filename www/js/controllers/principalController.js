angular.module('smartq').controller('principalController', function($scope, $ionicModal,smartqService){



    $scope.app={};
    $scope.app.slides=[];
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

    /*FUNÇÕES QUE PEGA DADOS DOS SLIDES DO SERVER E EXIBE*/

    function getServeQuadros() {
        smartqService.getServerQuadros()
        .then(function(json){
           smartqService.setQuadros(json.data);
           console.log(smartqService.getQuadros());
           $scope.app.slides=smartqService.getQuadros();
           $scope.description=$scope.app.slides[0].description;
       },function(){
        getServeQuadros();
    });

    }

    /*FUNÇÃO QUE DETECTA SE SLIDE MODIFICOU*/

    $scope.changeSlide=function(index){
        $scope.description=$scope.app.slides[index].description;
    }

//inicializa tela com dados do server
getServeQuadros() ;


$scope.teste=function(teste){
console.log(teste);
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



}
);