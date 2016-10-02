/**
 * @ngdoc controller
 * @name smartq.controller: nodataController
 * @description Controller da tela que é exibida quando o usuário não possui nenhum quadro cadastrado ainda.
 */
angular.module('smartq').controller('nodataController',  function($scope,$ionicPopup,localStorageService,$location,msg){
    $scope.mensagem=msg.ERROR.no_quadro;
    /**
    * @ngdoc method
    * @name  logout
    * @methodOf smartq.controller: nodataController
    * @description Método que executa o logoff do usuário, apagando os dados do mesmo localmente.
    */
    $scope.logout = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sair',
            template: 'Você deseja realmente executar esta ação?'
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