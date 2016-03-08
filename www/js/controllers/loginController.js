/**
*  Controller da tela de login
*/
angular.module('smartq').controller('loginController', function($scope,$http){
console.log( "teste");

$scope.loginSystem = function()
{

Oauth={};
Oauth.url="http://52.20.21.167:3500/oauth/";
Oauth.client_id= "5f7396418354799903da39cfbf7dbe11";
Oauth.client_secret= "9a41e2c35f4a143f7aae1d96b8cb8e18";

var url = Oauth.url+'new?client_id='+ Oauth.client_id + '&client_secret='+ Oauth.client_secret +'&redirect_uri=http://localhost' ;
//url="http://52.20.21.167:3500/oauth/token?client_id=5f7396418354799903da39cfbf7dbe11&client_secret=9a41e2c35f4a143f7aae1d96b8cb8e18&email=operador@smartq.com.br&password=smartquadro";
 // Open in app browser
 window.open(url,'_blank');

/*
$http({
  method: 'POST',
  url: url
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
*/




};



});