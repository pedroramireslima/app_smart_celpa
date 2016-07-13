//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('smartqService', function($http,config){

//variáveis que guardam os valores dos jsons localmente
var _quadros = {};
var _circuitos={};
var _quadro_atual={};
var _circuito_atual={};
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

var _getQuadroAtual = function (){
    return _quadro_atual;
};

var _setQuadroAtual = function (value) {
    _quadro_atual=value;
}

var _getCircuitoAtual = function (){
    return _circuito_atual;
};

var _setCircuitoAtual = function (value) {
    _circuito_atual=value;
}


var _quadrosDetalhes=function () {
  nome=  _quadro_atual.break_panel.name;
  percentual_quadro= parseFloat(_quadro_atual.break_panel.total_energy / _quadro_atual.break_panel.goal * _quadro_atual.consumer_type.tax * 100).toFixed(2);
  alvo=  _quadro_atual.break_panel.goal.toFixed(2);
  taxa= _quadro_atual.consumer_type.tax;
  due= _quadro_atual.break_panel.due;
  primeiro_dia= _quadro_atual.break_panel.first_day_of_period;
  series = ['POTENCIA'];
  days_in_m=_quadro_atual.days_in_m;
  measures_b_tuple=_convertTupla(_quadro_atual.measures_b_tuple);
  measures_b_tuple[0]=measures_b_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});
  measures_b_tuple[1]=[measures_b_tuple[1]];

  measures_b_tuple_diff=_convertTupla(_quadro_atual.measures_b_tuple_diff);
  measures_b_tuple_diff[0]=measures_b_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
  measures_b_tuple_diff[1]=[measures_b_tuple_diff[1]]

  previsions_b_tuple=_convertTupla(_quadro_atual.previsions_b_tuple);
  previsions_b_tuple[0]=previsions_b_tuple[0].map(function(obj){var a = new Date(obj); return a.getDate();});
  previsions_b_tuple[1]=[previsions_b_tuple[1]];

  circuito= _quadro_atual.circuits;
  circuito=circuito.map(function(atual){
    auxiliar=buscaById(_circuitos , atual.id);
    atual.total_energy=parseFloat(atual.total_energy).toFixed(2);
    atual.percent=parseFloat((atual.total_energy/auxiliar.goal)*taxa*100).toFixed(2);
    if ( atual.percent==Infinity) {
        atual.percent="-";
    }
    atual.valor=parseFloat((atual.total_energy)*taxa).toFixed(2);

    return atual;
});


  return {"nome": nome, "percentual":percentual_quadro,"alvo":alvo,"taxa":taxa,"days_in_m":days_in_m,"measures_b_tuple":measures_b_tuple, "measures_b_tuple_diff":measures_b_tuple_diff, "previsions_b_tuple": previsions_b_tuple, "circuitos":circuito,"first_day_of_period":primeiro_dia,"due":due,"series":series};
};

//Função que busca no array o elemento que possui um objeto com o id
function buscaById(array,id){
    var position=0;
    for (var i = 0; i < array.length; i++) {
       if (array[i].id == id) {
        position=i;
        i=array.length+2;
    }
}

//função que converte para dia
function convertDia(dado) {

}


return array[position];
}



//     SERVIDOR
//funções para pegar dado no servidor
var _getServerQuadros = function (){
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels.json?access_token="+config.SERVER.token,{timeout: 30000});

};

//funções para pegar circuitos do quadro atual no servidor
var _getServerCircuitos = function (id) {
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels/"+id+"/circuits.json?access_token="+config.SERVER.token,{timeout: 30000});

};

//Pega detalhes de um circuito
var _getServeCircuitoDetails = function (panel_id,circuito_id) {
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels/"+panel_id+"/circuits/"+circuito_id+".json?access_token="+config.SERVER.token,{timeout: 30000});
};

//Pega detalhes de um quadro
var _getServerQuadrosDetails = function (id){
    return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/1/break_panels/"+id+".json?access_token="+config.SERVER.token,{timeout: 30000});

};



//Converte tupla para formato de gráficos
var _convertTupla = function (data) {
    var array_1=[];
    var array_2=[];
    data.map(function(atual){
      array_1.push(atual[0]);
      array_2.push(atual[1]);
  });

    return [array_1, array_2]

};



//retorno do service
return {
    getServerQuadros :  _getServerQuadros,
    getQuadros: _getQuadros,
    setQuadros: _setQuadros,
    getServerCircuitos :  _getServerCircuitos,
    getCircuitos: _getCircuitos,
    setCircuitos: _setCircuitos,
    getServerQuadrosDetails:_getServerQuadrosDetails,
    getServeCircuitoDetails:_getServeCircuitoDetails,
    getQuadroAtual:_getQuadroAtual,
    setQuadroAtual:_setQuadroAtual,
    getCircuitoAtual:_getCircuitoAtual,
    setCircuitoAtual:_setCircuitoAtual,
    convertTupla:_convertTupla,
    quadrosDetalhes:_quadrosDetalhes
};


});




