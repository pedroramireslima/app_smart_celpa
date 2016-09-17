//Mensagens de alerta e erros

angular.module('smartq').constant('msg',{

ERROR:{
    not_internet : "Você não está conectado a internet!",
    internet     : "Não foi possível completar a requisição, verifique sua conexão com a internet.",
    operacao     : "Não foi possível completar a operação.",
    login        : "Ocorreu um erro durante o login.",
    user         : "Erro obtendo dados do usuário"
}

});