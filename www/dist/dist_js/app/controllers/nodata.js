angular.module('smartq').controller('nodataController',  ['$scope', '$ionicPopup', 'localStorageService', '$location', 'msg', function($scope,$ionicPopup,localStorageService,$location,msg){

    $scope.mensagem=msg.ERROR.no_quadro;
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


}]);