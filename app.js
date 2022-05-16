const express = require('express'),
    app = express(),
    routes = require('./routes'),
    config = require('./config/dev'),
    handlerError = require('./middlewares/handlerError'),
    cors = require('cors');

app.use(express.json());
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
    app.use(routes);
});

app.use(handlerError);

app.listen(config.application_port, ()=>{
    console.log(`Servidor Rodando na Porta ${config.application_port}`);
});