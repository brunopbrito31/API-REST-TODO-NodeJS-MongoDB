const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    console.log('Entrou na decodificação do token');
    
    let token = req.header('Authorization');
    token = token.replace('Bearer ','');
    token = jwt.decode(token);

    console.log(token);
    
    req.userId = token.id;

    next();
}