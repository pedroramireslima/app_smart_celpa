//Service para aquisição de dados e envio de dados

angular.module('smartq').factory('smartqService', function($http,config,localStorageService){

//variáveis que guardam os valores dos jsons localmente
var _quadros           = {};
var _circuitos         = {};
var _quadro_atual      = {};
var _circuito_atual    = {};
var _circuito_controle = {};
var _agendamentos      = {};
var _slide_position              = 0;

//funções para pegar dado local

var _set_slide_position= function(value){
  _slide_position = value;
};

var _get_slide_position= function(){
  return _slide_position;
}



var _getAgendamentos = function (){
  return _agendamentos;
};


var _setAgendamentos = function (value) {
  var groupedData = {ids:[]};

  for (var it = 0; it < value.length; it++) {
    var item = value[it];
    if (!groupedData[item.circuit_id]){
      groupedData[item.circuit_id] = [];
      for(var i=0; i<_circuitos.length; i++) {
        if(_circuitos[i].id === item.circuit_id) {
          groupedData.ids.push({id:item.circuit_id,name:_circuitos[i].name});
        }
      }
    }
    groupedData[item.circuit_id].push(item);
  }

  _agendamentos=  groupedData;
};



var _getControle = function (){
  return _circuito_controle;
};


var _setControle = function (value) {

  _circuito_controle=value;
};



var _getQuadros = function (){
  return _quadros;
};

var _setQuadros = function (value) {
  _quadros=value;
};

var _getCircuitos = function (){
  return _circuitos;
};

var _setCircuitos = function (value) {
  _circuitos=value;
};

var _getQuadroAtual = function (){
  return _quadro_atual;
};

var _setQuadroAtual = function (value) {
  _quadro_atual=value;
  formata_circuito();
};

var _getCircuitoAtual = function (){
  return _circuito_atual;
};

var _setCircuitoAtual = function (value) {
  _circuito_atual=trata_circuito_atual(value);

};

var _trata_controle=function (dado_controle){

  var auxiliar = [];
   for (var i = 0; i < dado_controle.saved_circuits.length; i++) {
          auxiliar.push({});
          auxiliar[i].name     = dado_controle.saved_circuits[i].name;
          auxiliar[i].value    = parseFloat(_quadro_atual.consumer_type.tax*dado_controle.saved_circuits[i].total_energy).toFixed(2);
          auxiliar[i].reais    = parseInt( dado_controle.saved_circuits[i].value);
          auxiliar[i].centavos = parseInt(parseFloat( dado_controle.saved_circuits[i].value -  auxiliar[i].reais).toFixed(2)*100);
          if (auxiliar[i].centavos<10) {
              auxiliar[i].centavos="0"+auxiliar[i].centavos;
          }

          for(var j=0; j<dado_controle.consumption_controls.length; j++) {
            if(dado_controle.consumption_controls[j].circuit_id === dado_controle.saved_circuits[i].id) {
                auxiliar[i].value_goal    = parseFloat(dado_controle.consumption_controls[j].threshold).toFixed(2);
                auxiliar[i].reais_goal    = parseInt( auxiliar[i].value_goal);
                auxiliar[i].centavos_goal = parseInt(parseFloat( auxiliar[i].value_goal -  auxiliar[i].reais_goal).toFixed(2)*100);
                if (auxiliar[i].centavos_goal<10) {
                  auxiliar[i].centavos_goal="0"+auxiliar[i].centavos_goal;
                }
                if (dado_controle.consumption_controls[j].always) {
                  auxiliar[i].date="todo mês"
                } else {
                  var data=dado_controle.consumption_controls[j].expiration_date.split("T")[0];
                  data=data.split("-");
                  auxiliar[i].date="até "+data[2]+"/"+data[1]+"/"+data[0];
                }

            }
          }
        auxiliar[i].percent=Math.round(auxiliar[i].value/auxiliar[i].value_goal*100);
    }
return auxiliar

};

function prevent(argument) {
  if (isNaN(argument)) {
    return "-";
  }else{
    return argument;
  }
}


function trata_circuito_atual(json) {
            json.data.measures_c_tuple=_convertTupla( json.data.measures_c_tuple);
            json.data.measures_c_tuple_diff=_convertTupla( json.data.measures_c_tuple_diff);
            json.data.value=parseFloat((json.data.circuit.total_energy) *(json.data.consumer_type.tax)).toFixed(2);
            json.data.reais=parseInt(json.data.value);
            json.data.centavos=parseInt(parseFloat(json.data.value - json.data.reais).toFixed(2)*100);
            if (json.data.centavos<10) {
              json.data.centavos="0"+json.data.centavos;
            }

            json.data.total=parseFloat((json.data.circuit.goal) *(json.data.consumer_type.tax)).toFixed(2);
            json.data.percent_money=Math.round(json.data.value/json.data.total*100);
            json.data.percent_consumo=Math.round(json.data.circuit.total_energy/json.data.break_panel.total_energy*100);
            json.data.percent_local=Math.round(json.data.circuit.total_energy/json.data.circuit.goal*100);
            if (json.data.percent_local==Infinity) {
              json.data.percent_local=0;
            }
            json.data.last_measure.voltage                = prevent(parseFloat(json.data.last_measure.voltage).toFixed(2));
            json.data.last_measure.power_factor           = prevent(parseFloat(json.data.last_measure.power_factor).toFixed(2));
            json.data.last_measure.current                = prevent(parseFloat(json.data.last_measure.current).toFixed(2));
            json.data.last_measure.import_active_energy   = prevent(parseFloat(json.data.last_measure.import_active_energy).toFixed(2));
            json.data.last_measure.import_reactive_energy = prevent(parseFloat(json.data.last_measure.import_reactive_energy).toFixed(2));
            json.data.last_measure.line_frequency         = prevent(parseFloat(json.data.last_measure.line_frequency).toFixed(2));
            json.data.goal_tuple                          = _convertTupla( json.data.goal_tuple);
            json.data.previsions_c_tuple_money            = _convertTupla( json.data.previsions_c_tuple_money);
            json.data.measures_c_tuple[0]                 = json.data.measures_c_tuple[0].map(function(obj){var a   = new Date(obj); return a.getDate();});
            json.data.measures_c_tuple_diff[0]            = json.data.measures_c_tuple_diff[0].map(function(obj){var a = new Date(obj); return a.getDate();});
            json.data.measures_c_tuple_diff[1]            = json.data.measures_c_tuple_diff[1];
            json.data.goal_tuple[0]                       = json.data.goal_tuple[0].map(function(obj){var a  = new Date(obj); return a.getDate();});
            var dia                               = new Date();
            dia                                   = dia.getDate();
            var vec                               = [0,0,0,0];
            var a                                 = json.data.goal_tuple[0].indexOf(dia);
            json.data.goal_tuple[0]               = json.data.goal_tuple[0].slice(a-3,a+4);
            json.data.measures_c_tuple[1]         = json.data.measures_c_tuple[1].slice(a-3,a+4);
            json.data.previsions_c_tuple_money[1] = vec.concat(json.data.previsions_c_tuple_money[1].slice(0,3));
            json.data.previsions_c_tuple_money[1] = json.data.previsions_c_tuple_money[1].map(Math.round);
            json.data.goal_tuple[1]               = json.data.goal_tuple[1].slice(a-3,a+4);
            json.data.measures_c_tuple_diff[1]    = json.data.measures_c_tuple_diff[1].slice(a-3,a+4);
            json.data.measures_c_tuple_diff[0]    = json.data.measures_c_tuple_diff[0].slice(a-3,a+4);
            return json.data;
}


function formata_circuito() {
    for (var i = 0; i < _circuitos.length; i++) {
      _circuitos[i].value =parseFloat(_quadro_atual.consumer_type.tax*_circuitos[i].total_energy).toFixed(2);
      _circuitos[i].reais=parseInt( _circuitos[i].value);
      _circuitos[i].centavos=parseInt(parseFloat( _circuitos[i].value -  _circuitos[i].reais).toFixed(2)*100);
      if (_circuitos[i].centavos<10) {
        _circuitos[i].centavos="0"+_circuitos[i].centavos;
      }
      _circuitos[i].percent=Math.round(_circuitos[i].total_energy/_quadro_atual.break_panel.total_energy*100);
    }

}


var _quadrosDetalhes=function () {

  nome=  _quadro_atual.break_panel.name;
  percentual_quadro= parseFloat(_quadro_atual.break_panel.total_energy / _quadro_atual.break_panel.goal * _quadro_atual.consumer_type.tax * 100).toFixed(2);
  if ( percentual_quadro==Infinity) {
    percentual_quadro="-";
  }


  alvo                     = _quadro_atual.break_panel.goal.toFixed(2);
  taxa                     = _quadro_atual.consumer_type.tax;
  bandeira                 = _quadro_atual.consumer_type.consumer_flag;
  due                      = _quadro_atual.break_panel.due;
  primeiro_dia             = _quadro_atual.break_panel.first_day_of_period;
  series                   = ['POTENCIA'];
  days_in_m                = _quadro_atual.days_in_m;
  measures_b_tuple         = _convertTupla(_quadro_atual.measures_b_tuple);
  measures_b_tuple[0]      = measures_b_tuple[0].map(function(obj){ var a   = new Date(obj); return a.getDate();});
  measures_b_tuple_diff    = _convertTupla(_quadro_atual.measures_b_tuple_diff);
  measures_b_tuple_diff[0] = measures_b_tuple_diff[0].map(function(obj){ var a  = new Date(obj); return a.getDate();});
  goal_b_tuple             = _convertTupla(_quadro_atual.goal_tuple);
  previsions_b_tuple       = _convertTupla(_quadro_atual.previsions_b_tuple);
  previsions_b_tuple[0]    = previsions_b_tuple[0].map(function(obj){ var a  = new Date(obj); return a.getDate();});
  ultimo_dia               = measures_b_tuple[0][measures_b_tuple[0].length - 1];
  var dia = new Date();
  dia     = dia.getDate();
  var a   = measures_b_tuple[0].indexOf(dia);
  var vec = [0,0,0,0];


  measures_b_tuple[0]      = measures_b_tuple[0].slice(a-3,a+4);
  measures_b_tuple[1]      = measures_b_tuple[1].slice(a-3,a+4);
  previsions_b_tuple[1]    = vec.concat(previsions_b_tuple[1].slice(0,3));
  previsions_b_tuple[1]    = previsions_b_tuple[1].map( Math.round);
  goal_b_tuple[1]          = goal_b_tuple[1].slice(a-3,a+4);
  measures_b_tuple_diff[1] = measures_b_tuple_diff[1].slice(a-3,a+4);
  measures_b_tuple_diff[0] = measures_b_tuple_diff[0].slice(a-3,a+4);
  mes                      = new Date();
  mes                      = mes.getMonth() + 1;
  if (ultimo_dia<31) {
    if(mes==12){
      proximo_mes = 1;
    }else{
      proximo_mes = mes + 1;}
    } else { proximo_mes = mes;}


  circuito= _quadro_atual.circuits;
  circuito=circuito.map(function(atual){
  atual.total_energy=parseFloat(atual.total_energy).toFixed(2);
  atual.percent=Math.round((atual.total_energy/_quadro_atual.break_panel.total_energy)*100);
  if ( atual.percent==Infinity) {
    atual.percent="-";
  }
  atual.valor=parseFloat((atual.total_energy)*taxa).toFixed(2);
  atual.panel_id=_quadro_atual.break_panel.id;

  return atual;
  });

  return {
    "nome"                  : nome,
    "percentual"            : percentual_quadro,
    "alvo"                  : alvo,
    "taxa"                  : taxa,
    "days_in_m"             : days_in_m,
    "measures_b_tuple"      : measures_b_tuple,
    "measures_b_tuple_diff" : measures_b_tuple_diff,
    "previsions_b_tuple"    : previsions_b_tuple,
    "circuitos"             : circuito,
    "first_day_of_period"   : primeiro_dia,
    "due"                   : due,
    "series"                : series,
    "goal_b_tuple"          : goal_b_tuple,
    "bandeira"              : bandeira,
    "mes"                   : mes,
    "ultimo_dia"            : ultimo_dia,
    "proximo_mes"           : proximo_mes
  };
};



//     SERVIDOR
var _getServerNotifications = function(){
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/alerts.json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};


//funções para pegar dado no servidor
var _getServerQuadros = function (){
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels.json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};

//funções para pegar circuitos do quadro atual no servidor
var _getServerCircuitos = function (id) {
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+id+"/circuits.json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};


//Pega detalhes de um circuito

var _getServeCircuitoDetails = function (panel_id,circuito_id) {
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+panel_id+"/circuits/"+circuito_id+".json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};


//Pega controle
var _getServeControle = function (panel_id) {
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+panel_id+"/consumption_controls.json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};


//Pega detalhes de um quadro
var _getServerQuadrosDetails = function (id){
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+id+".json?access_token="+localStorageService.get('access_token'),{timeout: 30000});

};

//Envia localização para o servidor
var _putLocation = function (latitude_value,longitude_value) {
  var dado =JSON.stringify( {
    user:{
      latitude : latitude_value,
      longitude : longitude_value}
    });


    return $http.put(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/update_location.json?access_token="+localStorageService.get('access_token'),dado);
  };


//Liga/desliga circuito
var _setEstadoCircuito = function (panel_id,circuito_id,estado) {
  return  $http.post(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+panel_id+"/circuits/"+circuito_id+"/action_circuit/"+estado+".json?access_token="+localStorageService.get('access_token'),{},{timeout: 30000});
};

//Pega vetor de agendamentos do painel
var _getServerAgendamentos = function (panel_id) {
  return  $http.get(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/break_panels/"+panel_id+"/schedulings.json?access_token="+localStorageService.get('access_token'),{timeout: 30000});
};

//Limpa notificações
var _clearNotification = function () {
    return  $http.post(config.SERVER.url+":"+config.SERVER.port+"/users/"+localStorageService.get('user_id')+"/clear_alerts?access_token="+localStorageService.get('access_token'),{},{timeout: 30000});
}


//Converte tupla para formato de gráficos
var _convertTupla = function (data) {
  var array_1=[];
  var array_2=[];
  data.map(function(atual){
      array_1.push(atual[0]);
      array_2.push(atual[1]);
  });

  return [array_1, array_2];

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
  quadrosDetalhes:_quadrosDetalhes,
  getServeControle:_getServeControle,
  getControle:_getControle,
  setControle:_setControle,
  setEstadoCircuito:_setEstadoCircuito,
  putLocation:_putLocation,
  getAgendamentos:_getAgendamentos,
  setAgendamentos:_setAgendamentos,
  getServerAgendamentos:_getServerAgendamentos,
  getServerNotifications:_getServerNotifications,
  set_slide_position:_set_slide_position,
  get_slide_position:_get_slide_position,
  trata_controle: _trata_controle,
  clearNotification: _clearNotification
};


});