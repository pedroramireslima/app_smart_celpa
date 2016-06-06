angular.module('smartq').controller('controleController',  function($scope, $ionicModal){


/* MODAL EDITAR CONTROLE */
    $ionicModal.fromTemplateUrl('templates/modal/controle-edit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.controleEditModal = modal;
    });


    $scope.openEditControle= function(){
//pega os dados para mostrar e abre modal de detalhes dos circuitos
$scope.controleEditModal.show();
};


});