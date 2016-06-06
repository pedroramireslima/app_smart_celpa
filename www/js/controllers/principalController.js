angular.module('smartq').controller('principalController', function($scope, $ionicModal){


$scope.app={}
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

$scope.app.slides=[
            {src: 'img/photo2.jpg', caption: 'Lorem ipsum dolor 1'},
            {src: 'img/photo3.jpg', caption: 'Lorem ipsum dolor 2'},
            {src: 'img/photo4.jpg', caption: 'Lorem ipsum dolor 3'},
            {src: 'img/photo5.jpg', caption: 'Lorem ipsum dolor 4'},
            {src: 'img/photo6.jpg', caption: 'Lorem ipsum dolor 5'}
        ];


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