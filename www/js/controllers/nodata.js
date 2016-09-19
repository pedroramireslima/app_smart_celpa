angular.module('smartq').controller('nodataController',  function($scope,$ionicPopup,localStorageService,$location){
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


});