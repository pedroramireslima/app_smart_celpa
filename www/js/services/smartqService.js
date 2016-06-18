//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('smartqService', function($http,config){

//variáveis que guardam os valores dos jsons localmente
var _quadros = {};
var _circuitos={};
//funções para pegar dado local
var _getQuadros = function (){
    return _quadros;
};

var _setQuadros = function (value) {
    _quadros=value;
}

var _getCircuitos = function (){
    return _circuitos;
};

var _setCircuitos = function (value) {
    _circuitos=value;
}



//funções para pegar dado no servidor
var _getServerQuadros = function (){
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels.json?access_token=28682f337db47de21ac469396466c333",{timeout: 30000});

};

//funções para pegar circuitos do quadro atual no servidor
var _getServerCircuitos = function (id) {
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels/"+id+"/circuits.json?access_token=28682f337db47de21ac469396466c333",{timeout: 30000});


};

//retorno do service
return {
    getServerQuadros :  _getServerQuadros,
    getQuadros: _getQuadros,
    setQuadros: _setQuadros,
    getServerCircuitos :  _getServerCircuitos,
    getCircuitos: _getCircuitos,
    setCircuitos: _setCircuitos
};


});



