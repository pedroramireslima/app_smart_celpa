NG_DOCS={
  "sections": {
    "api": "SQAPP"
  },
  "pages": [
    {
      "section": "api",
      "id": "index",
      "shortName": "index",
      "type": "overview",
      "moduleName": "index",
      "shortDescription": "Documentação Smart Quadro APP",
      "keywords": "2055b5edad6a6a60bf2c310761e586e3 3600 747798d6dc09df944ece50b7039c9267 abaixo abre access acessar adquirir ap api aplica aplicativo app aquisi atrav baixar br client code curl da dados de documenta efetuado endere essa estado feito foi http instalando ionic isso json login mesmo mostrada necess novamente oauth os overview para plugins plugis poss post quadro realizado redirecionado redirecionamento registrada reset resetar retorna secret seguintes seguir ser servidor smart smartqapp smartquadro tela token um url uso usu"
    },
    {
      "section": "api",
      "id": "smartq",
      "shortName": "smartq",
      "type": "object",
      "moduleName": "smartq",
      "shortDescription": "Módulo da aplicação, é aqui que são definidas as rotas que são utilizadas no aplicativo bem como as configurações.",
      "keywords": "api aplica aplicativo aqui bem como configura da definidas object rotas smartq utilizadas"
    },
    {
      "section": "api",
      "id": "smartq.controller: loginController",
      "shortName": "loginController",
      "type": "controller",
      "moduleName": "smartq",
      "shortDescription": "Controller responsável pelo login da aplicação. Verifica se o usuário já está logado, faz requisições das informações ao servidor.",
      "keywords": "agendamentos ainda ao api aplica ativo circuitos controles controller da dados das de demanda dologin dos espec est faz getserveragendamentos getservercircuitos getservercontrole getserverquadrodetails getserverquadros identificador informa localmente logado login logincontroller method os para pelo possui principal quadro quadros quando redireciona registrar requisi respons salva se servidor sim smartq tela um usu utilizado verifica"
    },
    {
      "section": "api",
      "id": "smartq.controller: nodataController",
      "shortName": "nodataController",
      "type": "controller",
      "moduleName": "smartq",
      "shortDescription": "Controller da tela que é exibida quando o usuário não possui nenhum quadro cadastrado ainda.",
      "keywords": "ainda apagando api cadastrado controller da dados executa exibida localmente logoff logout mesmo method nenhum nodatacontroller os possui quadro quando smartq tela usu"
    },
    {
      "section": "api",
      "id": "smartq.controller: principalController",
      "shortName": "principalController",
      "type": "controller",
      "moduleName": "smartq",
      "shortDescription": "Controller principal da aplicação, responsável por fazer requisições ao servidor e atualizar as telas que mostram os dados do smart quadro ao usuário.",
      "keywords": "abre abreagendamento abrecircuitos abrecontrole agendamento agendamentos ao api aplica aplicada aplicativo apresentada array assim atual atualiza atualizar atualmente carrossel centro changequadro changeslide circuito circuito_id circuitos classe closeall color componentes configura controle controles controller cor da dados dar das de demanda descri desejado detalhes deve dois dos entre espec estado faz fazer fecha foi get_color getserveragendamentos getservercircuitos getservercontrole getserverquadrodetails getupdatecircuitos gr graficocircuito graficoquadro html identifica identificador indica informa locais localmente logout menu method modais modal modifica modificado mostram muda mudando notifica novo openconfig opendetailscircuits opennotification openquadros os para por principal principalcontroller processo quadro quadro_id quadros qual requisi respons retorna salva selecionado ser servidor setstate slide smart smartq telas todos ui um usu utilizado vis"
    },
    {
      "section": "api",
      "id": "smartq.service: alerta",
      "shortName": "alerta",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service responsável por exibir mensagens ao usuário (pop-ups).",
      "keywords": "_msg abre alerta ao api exibida exibir mensagem mensagens message method para pop-up por respons ser service smartq title usu"
    },
    {
      "section": "api",
      "id": "smartq.service: BackgroundGeolocationService",
      "shortName": "BackgroundGeolocationService",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service responsável pelo serviço em background de localização do usuário.",
      "keywords": "adquirida ao api background backgroundgeolocationservice callback contendo coordenada coordenadas dados de dologin em envia erro error executada executado failurefn fun geolocaliza gps informa inicia localiza location method notifica nova objeto ocorrer para pega pegando pelo posi quando respons servi service servidor smartq start uma usu"
    },
    {
      "section": "api",
      "id": "smartq.service: config",
      "shortName": "config",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service contendo dados do servidor e do protocolo de login. (url, porta, id da aplicação oauth).",
      "keywords": "api aplica config contendo da dados de login oauth porta protocolo service servidor smartq"
    },
    {
      "section": "api",
      "id": "smartq.service: internet",
      "shortName": "internet",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service responsável por verificar conexão com a internet.",
      "keywords": "api conex internet por respons service smartq verificar"
    },
    {
      "section": "api",
      "id": "smartq.service: loading",
      "shortName": "loading",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service responsável por exibir o loading.",
      "keywords": "api de esconde exibe exibir hide loading method por respons service smartq tela"
    },
    {
      "section": "api",
      "id": "smartq.service: msg",
      "shortName": "msg",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service contendo as mensagens que são exibidas para o usuário.",
      "keywords": "api contendo exibidas mensagens msg para service smartq usu"
    },
    {
      "section": "api",
      "id": "smartq.service: smartqService",
      "shortName": "smartqService",
      "type": "service",
      "moduleName": "smartq",
      "shortDescription": "Service responsável por fazer as requisições http ao servidor, tratar, salvar e armazenar os dados.",
      "keywords": "_agendamentos _circuito_atual _circuito_controle _circuitos _clearnotifications _converttupla _get_slide_position _getagendamentos _getcircuitoatual _getcircuitos _getcontrole _getquadroatual _getquadros _getserveragendamentos _getservercircuitos _getservercontrole _getservernotifications _getserverquadros _getserverquadrosdetails _putlocation _quadro_atual _quadrodetalhes _quadros _setagendamentos _setcircuitoatual _setcircuitos _setcontrole _setestadocircuito _setquadroatual _setquadros _slide_position _trata_controle adicionais adicionando agendamentos analisada ao api app argument armazenar array atribu atribuido atual biblioteca circuito circuito_id circuitos colocando-os comando contendo controle controles controller da dado dado_controle dados data de demanda detalhes dos em envia enviando estado exibi fazer foram formata formata_circuito formatado formato gr http identificador informa json latitude latitude_value localiza longitude longitude_value method modifica nan notifica obejto objeto os panel_id para pega por possa prevent promise quadro quadros remove requisi respons retorna salvar ser service servidor set_slide_position smartq smartqservice trata_circuito_atual tratado tratar um usados usu utilizada utilizado valor valores vari verificado vindos visualizadas"
    }
  ],
  "apis": {
    "api": true
  },
  "__file": "_FAKE_DEST_/js/docs-setup.js",
  "__options": {
    "startPage": "/api",
    "scripts": [
      "js/angular.min.js",
      "js/angular-animate.min.js",
      "js/marked.js"
    ],
    "styles": [],
    "title": "Smart Quadro App",
    "html5Mode": true,
    "editExample": true,
    "navTemplate": false,
    "navContent": "",
    "navTemplateData": {},
    "image": "img/icon.png",
    "imageLink": "/api",
    "titleLink": "/api",
    "loadDefaults": {
      "angular": true,
      "angularAnimate": true,
      "marked": true
    }
  },
  "html5Mode": true,
  "editExample": true,
  "startPage": "/api",
  "scripts": [
    "js/angular.min.js",
    "js/angular-animate.min.js",
    "js/marked.js"
  ]
};