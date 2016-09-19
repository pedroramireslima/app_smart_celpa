//Mensagens de alerta e erros

angular.module('smartq').constant('msg',{

ERROR:{
    not_internet    : "Você não está conectado a internet!",
    internet        : "Não foi possível completar a requisição, verifique sua conexão com a internet.",
    operacao        : "Não foi possível completar a operação.",
    login           : "Ocorreu um erro durante o login.",
    user            : "Erro obtendo dados do usuário",
    no_quadro       : "Você ainda não possui nenhum quadro cadastrado!",
    no_controle     : "Você não possui nenhum controle cadastrado!",
    no_circuitos    : "Você não possui nehum ircuito cadastrado",
    no_agendamentos : "Você não possui nenhum agendamento cadastrado",
    other_user      : "Você logou em outro dispositivo com esta mesma conta ou nossos servidores estão temporariamente indisponíveis."
}

});